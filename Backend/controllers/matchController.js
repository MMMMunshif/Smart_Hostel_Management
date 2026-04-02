const User = require("../models/User");

const calculateScore = (u1, u2) => {
  let score = 0;

  if (u1.preferences.sleep === u2.preferences.sleep) score += 20;
  if (u1.preferences.cleanliness === u2.preferences.cleanliness) score += 20;
  if (u1.preferences.study === u2.preferences.study) score += 20;
  if (u1.preferences.smoking === u2.preferences.smoking) score += 20;
  if (u1.preferences.noise === u2.preferences.noise) score += 20;

  return score;
};

// ✅ NEW: get matches for logged-in user
exports.getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({ _id: { $ne: currentUser._id } });

    let matches = [];

    users.forEach((user) => {
      const score = calculateScore(currentUser, user);

      if (score >= 40) { // lower threshold for more results
        matches.push({
          name: user.name,
          meta: `${user.preferences.study || "Student"} lifestyle`,
          score,
        });
      }
    });

    // sort highest match first
    matches.sort((a, b) => b.score - a.score);

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};