import { useNavigate } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --teal:        #2dd4bf;
  --teal-mid:    #0d9488;
  --teal-dark:   #0f766e;
  --teal-soft:   rgba(45,212,191,0.12);
  --teal-glow:   rgba(45,212,191,0.28);
  --indigo:      #6366f1;
  --ink:         #0f172a;
  --ink-soft:    #1e293b;
  --muted:       #64748b;
  --light-muted: #94a3b8;
  --bg:          #f0fafa;
  --surface:     #ffffff;
  --border:      #e2e8f0;
}

html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; }

.hm-root {
  background: var(--bg);
  color: var(--ink);
  overflow-x: hidden;
}

/* ══ NAVBAR ══ */
.hm-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 16px 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(240,250,250,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(45,212,191,0.15);
}

.hm-logo { display: flex; align-items: center; gap: 10px; }

.hm-logo-icon {
  width: 38px; height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--teal), var(--teal-mid));
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 14px var(--teal-glow);
}

.hm-logo-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.2rem; font-weight: 900;
  color: var(--ink); letter-spacing: -0.03em;
}

.hm-nav-links { display: flex; gap: 28px; align-items: center; }

.hm-nav-link {
  font-size: 0.88rem; font-weight: 600;
  color: var(--muted); background: transparent; border: none;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: color 0.18s;
}
.hm-nav-link:hover { color: var(--ink); }

.hm-nav-signin {
  font-size: 0.88rem; font-weight: 700;
  color: var(--teal-dark); background: transparent;
  border: 1.5px solid rgba(45,212,191,0.4);
  border-radius: 11px; padding: 9px 20px;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: all 0.18s;
}
.hm-nav-signin:hover { background: var(--teal-soft); border-color: var(--teal); }

.hm-nav-cta {
  background: linear-gradient(135deg, var(--teal), var(--teal-mid));
  color: #fff; border: none; border-radius: 11px; padding: 10px 22px;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 16px var(--teal-glow);
  transition: transform 0.16s, box-shadow 0.16s;
}
.hm-nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--teal-glow); }

/* ══ HERO ══ */
.hm-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 130px 56px 60px;
  text-align: center;
}

.hm-hero::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 65% 50% at 15% 5%, rgba(45,212,191,0.16) 0%, transparent 55%),
    radial-gradient(ellipse 50% 45% at 85% 10%, rgba(99,102,241,0.09) 0%, transparent 55%),
    radial-gradient(ellipse 55% 55% at 50% 105%, rgba(45,212,191,0.07) 0%, transparent 55%);
  pointer-events: none;
}

/* Floating particles */
.hm-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.hm-particle {
  position: absolute; border-radius: 50%;
  background: var(--teal); opacity: 0.16;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 0.16; }
  90%  { opacity: 0.16; }
  100% { transform: translateY(-110px) scale(0.5); opacity: 0; }
}

/* Wave rings at the bottom */
.hm-rings {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 960px; height: 480px;
  pointer-events: none;
}

.hm-ring {
  position: absolute; bottom: -70px; left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  border: 1px solid rgba(45,212,191,0.16);
  animation: ring-pulse 5s ease-in-out infinite;
}

.hm-ring:nth-child(1) { width: 260px;  height: 130px;  animation-delay: 0s;   }
.hm-ring:nth-child(2) { width: 430px;  height: 215px;  animation-delay: 0.7s; background: rgba(45,212,191,0.03); }
.hm-ring:nth-child(3) { width: 600px;  height: 300px;  animation-delay: 1.4s; }
.hm-ring:nth-child(4) { width: 760px;  height: 380px;  animation-delay: 2.1s; background: rgba(45,212,191,0.02); }
.hm-ring:nth-child(5) { width: 960px;  height: 480px;  animation-delay: 2.8s; }

@keyframes ring-pulse {
  0%, 100% { opacity: 0.55; transform: translateX(-50%) scaleY(1); }
  50%       { opacity: 1;    transform: translateX(-50%) scaleY(1.05); }
}

/* Hero text */
.hm-hero-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  align-items: center; gap: 24px;
  max-width: 800px;
}

.hm-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(45,212,191,0.1);
  border: 1px solid rgba(45,212,191,0.3);
  border-radius: 999px; padding: 7px 18px;
  font-size: 0.78rem; font-weight: 700;
  color: var(--teal-dark); letter-spacing: 0.04em;
  animation: fade-up 0.5s ease both;
}

.hm-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--teal);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.35; transform: scale(0.65); }
}

.hm-hero-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.9rem);
  font-weight: 900; letter-spacing: -0.045em;
  line-height: 1.06; color: var(--ink);
  animation: fade-up 0.5s 0.08s ease both;
}

.hm-hero-title .accent {
  background: linear-gradient(135deg, var(--teal-mid), var(--indigo));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hm-hero-desc {
  font-size: 1.06rem; color: var(--muted);
  line-height: 1.78; max-width: 560px;
  animation: fade-up 0.5s 0.16s ease both;
}

.hm-hero-btns {
  display: flex; gap: 14px; flex-wrap: wrap;
  justify-content: center;
  animation: fade-up 0.5s 0.24s ease both;
}

.hm-btn-primary {
  background: linear-gradient(135deg, var(--teal), var(--teal-mid));
  color: #fff; border: none; border-radius: 14px;
  padding: 15px 32px; font-size: 0.96rem; font-weight: 800;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  box-shadow: 0 6px 24px var(--teal-glow);
  transition: transform 0.16s, box-shadow 0.16s;
}
.hm-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(45,212,191,0.38); }

.hm-btn-outline {
  background: #fff; color: var(--ink-soft);
  border: 1.5px solid var(--border); border-radius: 14px;
  padding: 15px 32px; font-size: 0.96rem; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(15,23,42,0.05);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.hm-btn-outline:hover { border-color: var(--teal); box-shadow: 0 4px 16px rgba(45,212,191,0.12); }

/* Stats */
.hm-hero-stats {
  display: flex; gap: 32px; align-items: center;
  flex-wrap: wrap; justify-content: center;
  animation: fade-up 0.5s 0.32s ease both;
}

.hm-hero-stat { text-align: center; }

.hm-hero-stat-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.5rem; font-weight: 900;
  letter-spacing: -0.03em; color: var(--ink);
}

.hm-hero-stat-label { font-size: 0.74rem; color: var(--light-muted); font-weight: 600; }
.hm-stat-sep { width: 1px; height: 34px; background: var(--border); }

/* ══ BUILDING ILLUSTRATION ══ */
.hm-illustration {
  position: relative; z-index: 2;
  width: 100%; max-width: 880px;
  margin-top: 20px;
  animation: fade-up 0.5s 0.4s ease both;
}

.hm-building-scene {
  width: 100%;
  filter: drop-shadow(0 20px 44px rgba(45,212,191,0.16));
}

/* Window animations */
@keyframes win-on {
  0%, 100% { fill: #fef9c3; }
  50%       { fill: #fde68a; }
}
@keyframes win-on2 {
  0%, 100% { fill: #dbeafe; }
  50%       { fill: #bfdbfe; }
}

.w-warm  { animation: win-on  3s ease-in-out infinite; }
.w-warm2 { animation: win-on  3s 1.1s ease-in-out infinite; }
.w-warm3 { animation: win-on  3s 2.2s ease-in-out infinite; }
.w-cool  { animation: win-on2 4s 0.5s ease-in-out infinite; }
.w-cool2 { animation: win-on2 4s 1.8s ease-in-out infinite; }
.w-off   { fill: #e0f2fe; }

/* Floating chips */
.hm-chips-wrap { position: absolute; inset: 0; pointer-events: none; }

.hm-chip {
  position: absolute; background: #fff;
  border: 1px solid var(--border); border-radius: 14px;
  padding: 9px 14px; display: flex; align-items: center;
  gap: 8px; font-size: 0.77rem; font-weight: 700;
  color: var(--ink-soft);
  box-shadow: 0 8px 24px rgba(15,23,42,0.09);
  white-space: nowrap;
}

.hm-chip-icon {
  width: 26px; height: 26px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; flex-shrink: 0;
}

.ci-teal   { background: rgba(45,212,191,0.14); }
.ci-indigo { background: rgba(99,102,241,0.12); }
.ci-amber  { background: rgba(251,191,36,0.14); }
.ci-green  { background: rgba(34,197,94,0.12);  }

.hm-chip-1 { top: 16%; left: -3%; animation: cf1 5s ease-in-out infinite; }
.hm-chip-2 { top: 12%; right:-3%; animation: cf2 6s ease-in-out infinite; }
.hm-chip-3 { bottom:24%; left:-2%; animation: cf3 7s ease-in-out infinite; }
.hm-chip-4 { bottom:22%; right:-2%; animation: cf4 5.5s ease-in-out infinite; }

@keyframes cf1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
@keyframes cf2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
@keyframes cf3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes cf4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(9px)} }

@keyframes fade-up {
  from { opacity:0; transform:translateY(22px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ══ TRUST BAR ══ */
.hm-trust {
  background: #fff;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 22px 56px;
  display: flex; align-items: center;
  justify-content: center; gap: 44px; flex-wrap: wrap;
}

.hm-trust-label {
  font-size: 0.73rem; font-weight: 800;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--light-muted);
}

.hm-trust-items { display: flex; gap: 30px; align-items: center; flex-wrap: wrap; }

.hm-trust-item {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.83rem; font-weight: 700; color: var(--muted);
}

/* ══ SECTION WRAPPER ══ */
.hm-section {
  padding: 96px 56px;
  max-width: 1200px;
  margin: 0 auto;
}

.hm-section-eyebrow {
  font-size: 0.71rem; font-weight: 800;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--teal-dark); margin-bottom: 11px;
}

.hm-section-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(1.75rem,3vw,2.45rem);
  font-weight: 900; letter-spacing: -0.034em;
  color: var(--ink); line-height: 1.1; margin-bottom: 13px;
}

.hm-section-sub {
  font-size: 0.98rem; color: var(--muted);
  line-height: 1.76; max-width: 520px; margin-bottom: 50px;
}

/* ══ HOW IT WORKS ══ */
.hm-steps-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 22px; position: relative;
}

.hm-steps-grid::before {
  content: ''; position: absolute;
  top: 34px;
  left: calc(16.5% + 20px); right: calc(16.5% + 20px);
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--teal), transparent);
  opacity: 0.4;
}

.hm-step {
  background: #fff; border: 1px solid var(--border);
  border-radius: 22px; padding: 28px 24px;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.hm-step:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(45,212,191,0.12);
  border-color: rgba(45,212,191,0.4);
}

.hm-step-num {
  width: 52px; height: 52px; border-radius: 16px;
  background: var(--teal-soft);
  border: 1px solid rgba(45,212,191,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; margin-bottom: 18px;
}

.hm-step-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.04rem; font-weight: 800;
  color: var(--ink); margin-bottom: 9px; letter-spacing: -0.02em;
}

.hm-step-desc { font-size: 0.87rem; color: var(--muted); line-height: 1.72; }

/* ══ FEATURES ══ */
.hm-features-bg {
  background: linear-gradient(180deg, #fff 0%, #f0fafa 100%);
  padding: 96px 0;
}

.hm-features-grid {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 20px;
}

.hm-feature {
  background: #fff; border: 1px solid var(--border);
  border-radius: 22px; padding: 28px 24px;
  position: relative; overflow: hidden;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.hm-feature::after {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--teal), var(--indigo));
  opacity: 0; transition: opacity 0.22s;
}

.hm-feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(45,212,191,0.1);
  border-color: rgba(45,212,191,0.3);
}
.hm-feature:hover::after { opacity: 1; }

.hm-feature-icon {
  width: 50px; height: 50px; border-radius: 15px;
  background: var(--teal-soft);
  border: 1px solid rgba(45,212,191,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.35rem; margin-bottom: 16px;
}

.hm-feature-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem; font-weight: 800;
  color: var(--ink); margin-bottom: 8px; letter-spacing: -0.02em;
}

.hm-feature-desc { font-size: 0.87rem; color: var(--muted); line-height: 1.72; }

/* ══ TESTIMONIALS ══ */
.hm-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }

.hm-testi {
  background: #fff; border: 1px solid var(--border);
  border-radius: 22px; padding: 28px;
  transition: transform 0.22s, box-shadow 0.22s;
}
.hm-testi:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(45,212,191,0.1); }

.hm-testi-stars { font-size: 0.88rem; letter-spacing: 2px; color: #f59e0b; margin-bottom: 14px; }

.hm-testi-quote {
  font-size: 0.9rem; color: var(--ink-soft);
  line-height: 1.75; margin-bottom: 20px; font-style: italic;
}

.hm-testi-author { display: flex; align-items: center; gap: 12px; }

.hm-testi-avatar {
  width: 42px; height: 42px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.88rem; font-weight: 900;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #fff; flex-shrink: 0;
}

.ta-a { background: linear-gradient(135deg, #2dd4bf, #0d9488); }
.ta-b { background: linear-gradient(135deg, #93c5fd, #6366f1); }
.ta-c { background: linear-gradient(135deg, #f9a8d4, #ec4899); }

.hm-testi-name  { font-size: 0.88rem; font-weight: 800; color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; }
.hm-testi-role  { font-size: 0.74rem; color: var(--light-muted); }

/* ══ CTA ══ */
.hm-cta-wrap { padding: 0 56px 96px; }

.hm-cta {
  border-radius: 28px;
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 45%, #6366f1 100%);
  padding: 80px 64px; text-align: center;
  position: relative; overflow: hidden;
}

.hm-cta::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 80% at 50% -10%, rgba(255,255,255,0.14) 0%, transparent 60%);
  pointer-events: none;
}

.hm-cta-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.hm-cta-eyebrow {
  font-size: 0.71rem; font-weight: 800; letter-spacing: 0.14em;
  text-transform: uppercase; color: rgba(255,255,255,0.6);
  margin-bottom: 14px; position: relative;
}

.hm-cta-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(1.8rem,3.5vw,2.8rem); font-weight: 900;
  letter-spacing: -0.04em; color: #fff;
  margin-bottom: 14px; line-height: 1.08; position: relative;
}

.hm-cta-sub {
  font-size: 1rem; color: rgba(255,255,255,0.7);
  margin-bottom: 36px; max-width: 480px;
  margin-left: auto; margin-right: auto;
  line-height: 1.68; position: relative;
}

.hm-cta-btns {
  display: flex; gap: 14px; justify-content: center;
  flex-wrap: wrap; position: relative;
}

.hm-btn-cta-white {
  background: #fff; color: var(--teal-dark);
  border: none; border-radius: 14px; padding: 15px 32px;
  font-size: 0.96rem; font-weight: 800; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  transition: transform 0.16s, box-shadow 0.16s;
}
.hm-btn-cta-white:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }

.hm-btn-cta-ghost {
  background: rgba(255,255,255,0.12); color: #fff;
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 14px; padding: 15px 32px;
  font-size: 0.96rem; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.18s; backdrop-filter: blur(8px);
}
.hm-btn-cta-ghost:hover { background: rgba(255,255,255,0.2); }

/* ══ FOOTER ══ */
.hm-footer {
  background: #fff; border-top: 1px solid var(--border);
  padding: 26px 56px;
  display: flex; justify-content: space-between;
  align-items: center; gap: 16px; flex-wrap: wrap;
}

.hm-footer-copy { font-size: 0.82rem; color: var(--light-muted); }
.hm-footer-links { display: flex; gap: 24px; }

.hm-footer-link {
  font-size: 0.82rem; color: var(--light-muted);
  background: transparent; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: color 0.16s;
}
.hm-footer-link:hover { color: var(--ink); }

/* ══ RESPONSIVE ══ */
@media (max-width: 1024px) {
  .hm-steps-grid, .hm-features-grid, .hm-testi-grid { grid-template-columns: 1fr 1fr; }
  .hm-steps-grid::before { display: none; }
}

@media (max-width: 700px) {
  .hm-nav   { padding: 14px 20px; }
  .hm-nav-links { display: none; }
  .hm-hero  { padding: 100px 20px 60px; }
  .hm-trust, .hm-section, .hm-cta-wrap { padding-left: 20px; padding-right: 20px; }
  .hm-steps-grid, .hm-features-grid, .hm-testi-grid { grid-template-columns: 1fr; }
  .hm-cta   { padding: 48px 24px; }
  .hm-footer { padding: 20px; flex-direction: column; text-align: center; }
  .hm-chip-1, .hm-chip-2, .hm-chip-3, .hm-chip-4 { display: none; }
}
`;

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hm-root">
      <style>{css}</style>

      {/* ── NAVBAR ── */}
      <nav className="hm-nav">
        <div className="hm-logo">
          <div className="hm-logo-icon">🏠</div>
          <span className="hm-logo-text">NestMate</span>
        </div>
        <div className="hm-nav-links">
          <button className="hm-nav-link" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>How it works</button>
          <button className="hm-nav-link" onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}>Features</button>
          <button className="hm-nav-link" onClick={() => document.getElementById("reviews").scrollIntoView({ behavior: "smooth" })}>Reviews</button>
          <button className="hm-nav-signin" onClick={() => navigate("/login")}>Sign In</button>
          <button className="hm-nav-cta"    onClick={() => navigate("/register")}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hm-hero">
        {/* Animated wave rings */}
        <div className="hm-rings">
          {[...Array(5)].map((_,i) => <div className="hm-ring" key={i} />)}
        </div>

        {/* Floating particles */}
        <div className="hm-particles">
          {[...Array(14)].map((_,i) => (
            <div key={i} className="hm-particle" style={{
              left: `${6 + i * 6.5}%`,
              bottom: `${8 + (i % 5) * 10}%`,
              width:  `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              animationDuration: `${4 + (i % 5)}s`,
              animationDelay:    `${i * 0.35}s`,
            }} />
          ))}
        </div>

        <div className="hm-hero-content">
          <div className="hm-badge">
            <span className="hm-badge-dot" />
            Smart Hostel Management System
          </div>

          <h1 className="hm-hero-title">
            Find Your Perfect<br />
            <span className="accent">Roommate &amp; Room</span><br />
            Effortlessly
          </h1>

          <p className="hm-hero-desc">
            NestMate connects students with compatible roommates and available rooms
            using smart preference-based matching — designed for seamless, stress-free hostel living.
          </p>

          <div className="hm-hero-btns">
            <button className="hm-btn-primary" onClick={() => navigate("/register")}>
              Get Started Free →
            </button>
            <button className="hm-btn-outline" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </button>
          </div>

          <div className="hm-hero-stats">
            {[["500+","Students"],["200+","Rooms"],["94%","Match Rate"],["24/7","Support"]].map(([v,l],i,arr) => (
              <>
                <div className="hm-hero-stat" key={l}>
                  <div className="hm-hero-stat-val">{v}</div>
                  <div className="hm-hero-stat-label">{l}</div>
                </div>
                {i < arr.length - 1 && <div className="hm-stat-sep" key={`sep-${i}`} />}
              </>
            ))}
          </div>

          {/* ── ANIMATED HOSTEL BUILDING ILLUSTRATION ── */}
          <div className="hm-illustration">
            <div className="hm-chips-wrap">
              <div className="hm-chip hm-chip-1">
                <div className="hm-chip-icon ci-teal">✅</div>
                Room B-101 · Assigned
              </div>
              <div className="hm-chip hm-chip-2">
                <div className="hm-chip-icon ci-indigo">👥</div>
                94% Compatibility Match
              </div>
              <div className="hm-chip hm-chip-3">
                <div className="hm-chip-icon ci-amber">⚡</div>
                All Facilities Live
              </div>
              <div className="hm-chip hm-chip-4">
                <div className="hm-chip-icon ci-green">🛫</div>
                Leave Request Approved
              </div>
            </div>

            <svg className="hm-building-scene" viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" fill="none">
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0f7f6"/>
                  <stop offset="100%" stopColor="#f0fafa"/>
                </linearGradient>
                <linearGradient id="bldMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff"/>
                  <stop offset="100%" stopColor="#f0fdfa"/>
                </linearGradient>
                <linearGradient id="bldSide" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc"/>
                  <stop offset="100%" stopColor="#e8f4f8"/>
                </linearGradient>
                <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2e8f0"/>
                  <stop offset="100%" stopColor="#cbd5e1"/>
                </linearGradient>
                <filter id="bshadow">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0d9488" floodOpacity="0.09"/>
                </filter>
              </defs>

              {/* Sky */}
              <rect width="900" height="360" fill="url(#sky)" rx="20"/>

              {/* Clouds */}
              <g opacity="0.6">
                <ellipse cx="115" cy="55" rx="52" ry="20" fill="#fff"/>
                <ellipse cx="148" cy="47" rx="36" ry="17" fill="#fff"/>
                <ellipse cx="82"  cy="51" rx="30" ry="15" fill="#fff"/>

                <ellipse cx="755" cy="65" rx="48" ry="19" fill="#fff"/>
                <ellipse cx="788" cy="57" rx="33" ry="15" fill="#fff"/>
                <ellipse cx="725" cy="62" rx="27" ry="13" fill="#fff"/>

                <ellipse cx="440" cy="38" rx="38" ry="16" fill="#fff"/>
                <ellipse cx="468" cy="31" rx="26" ry="12" fill="#fff"/>
              </g>

              {/* Sun */}
              <circle cx="810" cy="52" r="26" fill="#fde68a" opacity="0.65"/>
              <circle cx="810" cy="52" r="34" fill="none" stroke="#fde68a" strokeWidth="1.5" opacity="0.28"/>

              {/* Trees left */}
              <g>
                <rect x="38"  y="258" width="8" height="42" fill="#a7f3d0" rx="2"/>
                <ellipse cx="42"  cy="250" rx="22" ry="26" fill="#6ee7b7"/>
                <ellipse cx="42"  cy="243" rx="16" ry="20" fill="#34d399"/>
                <rect x="66"  y="265" width="7" height="35" fill="#a7f3d0" rx="2"/>
                <ellipse cx="69"  cy="257" rx="18" ry="22" fill="#6ee7b7"/>
                <ellipse cx="69"  cy="250" rx="13" ry="17" fill="#34d399"/>
              </g>

              {/* Trees right */}
              <g>
                <rect x="848" y="258" width="8" height="42" fill="#a7f3d0" rx="2"/>
                <ellipse cx="852" cy="250" rx="22" ry="26" fill="#6ee7b7"/>
                <ellipse cx="852" cy="243" rx="16" ry="20" fill="#34d399"/>
                <rect x="822" y="265" width="7" height="35" fill="#a7f3d0" rx="2"/>
                <ellipse cx="825" cy="257" rx="18" ry="22" fill="#6ee7b7"/>
                <ellipse cx="825" cy="250" rx="13" ry="17" fill="#34d399"/>
              </g>

              {/* ── MAIN BUILDING ── */}
              <g filter="url(#bshadow)">
                <rect x="255" y="105" width="390" height="215" fill="url(#bldMain)" rx="5"/>
                {/* Teal top stripe */}
                <rect x="255" y="105" width="390" height="9"   fill="#2dd4bf" rx="5"/>
                {/* Roof parapet */}
                <rect x="240" y="93"  width="420" height="18"  fill="#0d9488" rx="4"/>
                {/* Sign */}
                <rect x="345" y="83"  width="210" height="20"  fill="#0f766e" rx="4"/>
                <text x="450" y="97" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">NESTMATE HOSTEL</text>
                {/* Wi-Fi on rooftop */}
                <g transform="translate(436,74)" opacity="0.8">
                  <path d="M-11 0 Q0 -9 11 0"  stroke="#2dd4bf" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
                  <path d="M-6.5 5 Q0 1 6.5 5" stroke="#2dd4bf" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
                  <circle cx="0" cy="8.5" r="2.2" fill="#2dd4bf"/>
                </g>

                {/* Floor lines */}
                <line x1="255" y1="175" x2="645" y2="175" stroke="#e2e8f0" strokeWidth="1.2"/>
                <line x1="255" y1="243" x2="645" y2="243" stroke="#e2e8f0" strokeWidth="1.2"/>

                {/* Floor 1 windows */}
                {[272,328,384,440,496,552,608].map((x,i) => (
                  <g key={`f1-${i}`}>
                    <rect x={x} y="117" width="34" height="44" rx="3"
                      className={[0,3,5].includes(i) ? "w-warm" : [1,4].includes(i) ? "w-warm2" : [2].includes(i) ? "w-cool" : "w-off"}
                    />
                    <line x1={x+17} y1="117" x2={x+17} y2="161" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8"/>
                    <line x1={x}    y1="139" x2={x+34} y2="139" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8"/>
                  </g>
                ))}

                {/* Floor 2 windows */}
                {[272,328,384,440,496,552,608].map((x,i) => (
                  <g key={`f2-${i}`}>
                    <rect x={x} y="187" width="34" height="44" rx="3"
                      className={[1,4,6].includes(i) ? "w-warm3" : [0,3].includes(i) ? "w-cool2" : "w-off"}
                    />
                    <line x1={x+17} y1="187" x2={x+17} y2="231" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8"/>
                    <line x1={x}    y1="209" x2={x+34} y2="209" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8"/>
                  </g>
                ))}

                {/* Ground floor */}
                {/* Left ground window */}
                <rect x="272" y="255" width="100" height="65" rx="4" fill="rgba(45,212,191,0.07)" stroke="#a7f3d0" strokeWidth="1.2"/>
                <text x="322" y="278" textAnchor="middle" fill="#0d9488" fontSize="9"   fontWeight="800" fontFamily="DM Sans">RECEPTION</text>
                <text x="322" y="292" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="DM Sans">Open 24 / 7</text>

                {/* Main door */}
                <rect x="400" y="255" width="100" height="65" rx="4" fill="#0d9488"/>
                <rect x="404" y="259" width="44"  height="61" rx="3" fill="#0f766e"/>
                <rect x="452" y="259" width="44"  height="61" rx="3" fill="#0f766e"/>
                <circle cx="450" cy="292" r="3.5" fill="#2dd4bf"/>
                <circle cx="462" cy="292" r="3.5" fill="#2dd4bf"/>
                <path d="M400 255 Q450 235 500 255" fill="none" stroke="#2dd4bf" strokeWidth="2.2"/>

                {/* Right ground window */}
                <rect x="528" y="255" width="100" height="65" rx="4" fill="rgba(45,212,191,0.07)" stroke="#a7f3d0" strokeWidth="1.2"/>
                <text x="578" y="278" textAnchor="middle" fill="#0d9488" fontSize="9"   fontWeight="800" fontFamily="DM Sans">WARDEN</text>
                <text x="578" y="292" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="DM Sans">Office</text>

                {/* Steps */}
                <rect x="388" y="316" width="124" height="6" rx="2" fill="#94a3b8"/>
                <rect x="396" y="320" width="108" height="5" rx="2" fill="#cbd5e1"/>
              </g>

              {/* ── LEFT WING ── */}
              <g filter="url(#bshadow)">
                <rect x="100" y="158" width="160" height="162" fill="url(#bldSide)" rx="4"/>
                <rect x="100" y="158" width="160" height="8"   fill="#5eead4" rx="4"/>
                {[112,152,192].map((x,i) => (
                  <g key={`lw-${i}`}>
                    <rect x={x} y="172" width="30" height="36" rx="3" className={i===1 ? "w-warm2" : i===0 ? "w-cool" : "w-off"}/>
                    <rect x={x} y="222" width="30" height="36" rx="3" className={i===2 ? "w-warm3" : "w-off"}/>
                  </g>
                ))}
                <rect x="140" y="282" width="50" height="38" rx="3" fill="#5eead4"/>
              </g>

              {/* ── RIGHT WING ── */}
              <g filter="url(#bshadow)">
                <rect x="640" y="158" width="160" height="162" fill="url(#bldSide)" rx="4"/>
                <rect x="640" y="158" width="160" height="8"   fill="#5eead4" rx="4"/>
                {[650,690,730].map((x,i) => (
                  <g key={`rw-${i}`}>
                    <rect x={x} y="172" width="30" height="36" rx="3" className={i===0 ? "w-warm" : i===2 ? "w-cool2" : "w-off"}/>
                    <rect x={x} y="222" width="30" height="36" rx="3" className={i===1 ? "w-warm2" : "w-off"}/>
                  </g>
                ))}
                <rect x="710" y="282" width="50" height="38" rx="3" fill="#5eead4"/>
              </g>

              {/* ── ROAD ── */}
              <rect x="0" y="316" width="900" height="44" fill="url(#road)"/>
              {/* Road dashes */}
              {[50,150,250,350,450,550,650,750,850].map((x,i) => (
                <rect key={i} x={x} y="336" width="62" height="5" rx="2" fill="#fff" opacity="0.5"/>
              ))}
              {/* Footpath */}
              <rect x="0" y="314" width="900" height="6" fill="#e2e8f0"/>

              {/* Lamp posts */}
              {[185,715].map((x,i) => (
                <g key={`lp-${i}`}>
                  <rect x={x} y="240" width="5" height="76" fill="#94a3b8" rx="2"/>
                  <path d={`M${x+2.5} 240 Q${x+22} 230 ${x+30} 240`} stroke="#94a3b8" strokeWidth="2" fill="none"/>
                  <ellipse cx={x+30} cy="241" rx="16" ry="6" fill="#fef9c3" opacity="0.75"/>
                  <ellipse cx={x+30} cy="248" rx="22" ry="10" fill="#fef9c3" opacity="0.12"/>
                </g>
              ))}

              {/* Tiny people */}
              <g opacity="0.3">
                <circle cx="370" cy="312" r="5" fill="#0d9488"/>
                <rect x="367" y="317" width="6" height="9" rx="2" fill="#0d9488"/>
                <circle cx="530" cy="312" r="5" fill="#6366f1"/>
                <rect x="527" y="317" width="6" height="9" rx="2" fill="#6366f1"/>
                <circle cx="450" cy="312" r="5" fill="#f59e0b"/>
                <rect x="447" y="317" width="6" height="9" rx="2" fill="#f59e0b"/>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="hm-trust">
        <span className="hm-trust-label">Everything included</span>
        <div className="hm-trust-items">
          {["🏠 Room Booking","👥 Smart Matching","⚠️ Complaints","🛫 Leave Requests","👤 Visitor Logs","📊 Admin Dashboard"].map(t => (
            <span className="hm-trust-item" key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how">
        <div className="hm-section">
          <div className="hm-section-eyebrow">How It Works</div>
          <h2 className="hm-section-title">Simple. Smart. Seamless.</h2>
          <p className="hm-section-sub">Get matched with your ideal roommate in three easy steps.</p>
          <div className="hm-steps-grid">
            {[
              { e:"📝", t:"Create Your Profile",  d:"Sign up and fill in your lifestyle preferences — sleep schedule, study habits, cleanliness, and more to power smart matching." },
              { e:"🤝", t:"Get Matched",           d:"Our algorithm instantly finds the most compatible roommates based on your preferences and assigns a compatibility score." },
              { e:"🏠", t:"Move In",               d:"Request a room, get admin approval, and move in. Manage everything — leave, visitors, complaints — from one dashboard." },
            ].map(s => (
              <div className="hm-step" key={s.t}>
                <div className="hm-step-num">{s.e}</div>
                <div className="hm-step-title">{s.t}</div>
                <p className="hm-step-desc">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <div className="hm-features-bg" id="features">
        <div className="hm-section" style={{ paddingTop:0, paddingBottom:0 }}>
          <div className="hm-section-eyebrow">Features</div>
          <h2 className="hm-section-title">Everything You Need</h2>
          <p className="hm-section-sub">A complete hostel management platform built for students and wardens alike.</p>
          <div className="hm-features-grid">
            {[
              { i:"🤝", t:"Smart Roommate Matching",   d:"Compatibility scoring based on lifestyle, habits, and personal preferences to find your perfect match." },
              { i:"🏠", t:"Room Booking & Management", d:"Browse available rooms with photos, pricing, and amenities, then request your room instantly." },
              { i:"⚠️", t:"Complaint System",           d:"Raise and track maintenance or hostel complaints with real-time status updates from management." },
              { i:"🛫", t:"Leave Management",           d:"Apply for leave from your dashboard with automated approval workflows and instant notifications." },
              { i:"👤", t:"Visitor Registration",       d:"Register visitors in advance and give wardens full oversight of hostel access and guest logs." },
              { i:"📊", t:"Admin Dashboard",            d:"Wardens get a full overview of occupancy, requests, complaints, and all student activity." },
            ].map(f => (
              <div className="hm-feature" key={f.t}>
                <div className="hm-feature-icon">{f.i}</div>
                <div className="hm-feature-title">{f.t}</div>
                <p className="hm-feature-desc">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews">
        <div className="hm-section">
          <div className="hm-section-eyebrow">Student Stories</div>
          <h2 className="hm-section-title">Loved by Students</h2>
          <p className="hm-section-sub" style={{ marginBottom:46 }}>Real experiences from students using NestMate every day.</p>
          <div className="hm-testi-grid">
            {[
              { c:"ta-a", i:"AK", n:"Amal Kumara", r:"2nd Year · Computer Science", s:"★★★★★", q:"NestMate matched me with someone who has the exact same study schedule and cleanliness standard. Moving in was seamless and stress-free." },
              { c:"ta-b", i:"RS", n:"Ravi Silva",   r:"3rd Year · Engineering",      s:"★★★★★", q:"The room booking system is so intuitive. I found my room, applied, and got approved within 24 hours. The dashboard keeps everything organised." },
              { c:"ta-c", i:"PN", n:"Priya Nair",   r:"1st Year · Business Studies", s:"★★★★★", q:"As a first-year student I was worried about finding a good roommate. NestMate took all the guesswork out of it. Highly recommended!" },
            ].map(t => (
              <div className="hm-testi" key={t.n}>
                <div className="hm-testi-stars">{t.s}</div>
                <p className="hm-testi-quote">"{t.q}"</p>
                <div className="hm-testi-author">
                  <div className={`hm-testi-avatar ${t.c}`}>{t.i}</div>
                  <div>
                    <div className="hm-testi-name">{t.n}</div>
                    <div className="hm-testi-role">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="hm-cta-wrap">
        <div className="hm-cta">
          <div className="hm-cta-grid" />
          <div className="hm-cta-eyebrow">Ready to get started?</div>
          <h2 className="hm-cta-title">Your Perfect Room is Waiting</h2>
          <p className="hm-cta-sub">
            Join hundreds of students already using NestMate for smarter, stress-free hostel living.
          </p>
          <div className="hm-cta-btns">
            <button className="hm-btn-cta-white" onClick={() => navigate("/register")}>Sign Up Free →</button>
            <button className="hm-btn-cta-ghost" onClick={() => navigate("/login")}>Sign In</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="hm-footer">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="hm-logo-icon" style={{ width:28, height:28, fontSize:"0.8rem" }}>🏠</div>
          <span className="hm-footer-copy">© 2026 NestMate. All rights reserved.</span>
        </div>
        <div className="hm-footer-links">
          <button className="hm-footer-link">Privacy</button>
          <button className="hm-footer-link">Terms</button>
          <button className="hm-footer-link">Contact</button>
        </div>
      </footer>
    </div>
  );
}

export default Home;  