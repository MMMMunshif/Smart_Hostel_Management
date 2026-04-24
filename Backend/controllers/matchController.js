const User = require("../models/User");

const WEIGHTS = {
  sleep: 25,
  cleanliness: 25,
  study: 15,
  smoking: 20,
  noise: 15,
};

const NOISE_LEVELS = {
  low: 1,
  medium: 2,
  high: 3,
};

const getProfileCompleteness = (prefs = {}) => {
  let filled = 0;
  const total = 5;

  if (prefs.sleep) filled += 1;
  if (prefs.cleanliness !== undefined && prefs.cleanliness !== null && prefs.cleanliness !== "") filled += 1;
  if (prefs.study) filled += 1;
  if (prefs.smoking) filled += 1;
  if (prefs.noise) filled += 1;

  return Math.round((filled / total) * 100);
};

const scoreSleep = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return WEIGHTS.sleep;
  return 0;
};

const scoreCleanliness = (a, b) => {
  if (a === undefined || a === null || b === undefined || b === null) return 0;

  const diff = Math.abs(Number(a) - Number(b));

  if (diff === 0) return WEIGHTS.cleanliness;
  if (diff === 1) return 18;
  if (diff === 2) return 10;
  return 0;
};

const scoreStudy = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return WEIGHTS.study;
  return 5;
};

const scoreSmoking = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return WEIGHTS.smoking;

  // stronger penalty for smoker/non-smoker mismatch
  return -10;
};

const scoreNoise = (a, b) => {
  if (!a || !b) return 0;
  if (!(a in NOISE_LEVELS) || !(b in NOISE_LEVELS)) return 0;

  const diff = Math.abs(NOISE_LEVELS[a] - NOISE_LEVELS[b]);

  if (diff === 0) return WEIGHTS.noise;
  if (diff === 1) return 8;
  return -5;
};

const buildReasons = (p1 = {}, p2 = {}) => {
  const reasons = [];

  if (p1.sleep && p1.sleep === p2.sleep) {
    reasons.push(p1.sleep === "early" ? "Early Bird" : "Night Owl");
  }

  if (p1.study && p1.study === p2.study) {
    reasons.push(p1.study === "silent" ? "Quiet Study" : "Group Study");
  }

  if (p1.smoking && p1.smoking === p2.smoking) {
    reasons.push(p1.smoking === "no" ? "Non-smoker" : "Smoker");
  }

  if (
    p1.cleanliness !== undefined &&
    p2.cleanliness !== undefined &&
    Math.abs(Number(p1.cleanliness) - Number(p2.cleanliness)) <= 1
  ) {
    reasons.push("Cleanliness Match");
  }

  if (p1.noise && p1.noise === p2.noise) {
    reasons.push("Noise Compatible");
  }

  return reasons.slice(0, 3);
};

const buildConflicts = (p1 = {}, p2 = {}) => {
  const conflicts = [];

  if (p1.smoking && p2.smoking && p1.smoking !== p2.smoking) {
    conflicts.push("Smoking Preference Conflict");
  }

  if (p1.sleep && p2.sleep && p1.sleep !== p2.sleep) {
    conflicts.push("Different Sleep Schedule");
  }

  if (
    p1.noise &&
    p2.noise &&
    p1.noise in NOISE_LEVELS &&
    p2.noise in NOISE_LEVELS &&
    Math.abs(NOISE_LEVELS[p1.noise] - NOISE_LEVELS[p2.noise]) >= 2
  ) {
    conflicts.push("Noise Level Mismatch");
  }

  return conflicts.slice(0, 2);
};

const calculateMatch = (u1, u2) => {
  const p1 = u1.preferences || {};
  const p2 = u2.preferences || {};

  const breakdown = {
    sleep: scoreSleep(p1.sleep, p2.sleep),
    cleanliness: scoreCleanliness(p1.cleanliness, p2.cleanliness),
    study: scoreStudy(p1.study, p2.study),
    smoking: scoreSmoking(p1.smoking, p2.smoking),
    noise: scoreNoise(p1.noise, p2.noise),
  };

  const maxScore = Object.values(WEIGHTS).reduce((sum, value) => sum + value, 0);
  let rawScore = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  // penalty for incomplete profile
  const completeness = getProfileCompleteness(p2);
  if (completeness < 60) rawScore -= 10;
  if (completeness < 40) rawScore -= 10;

  if (rawScore < 0) rawScore = 0;

  const score = Math.round((rawScore / maxScore) * 100);

  return {
    score,
    rawScore,
    maxScore,
    profileCompleteness: completeness,
    breakdown,
    reasons: buildReasons(p1, p2),
    conflicts: buildConflicts(p1, p2),
  };
};

// GET matches for logged-in / requested student
exports.getMatches = async (req, res) => {
  try {
    const userId = req.params.id || req.user?._id;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
      role: "student",
      isActive: true,
    });

    const matches = users
      .map((user) => {
        const match = calculateMatch(currentUser, user);

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences || {},
          score: match.score,
          profileCompleteness: match.profileCompleteness,
          reasons: match.reasons,
          conflicts: match.conflicts,
          breakdown: match.breakdown,
          meta: `${user.preferences?.study || "Student"} lifestyle`,
        };
      })
      .filter((m) => m.score >= 45)
      .sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};