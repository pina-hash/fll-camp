// ===========================================================================
// EXTERNAL RESOURCES — edit links in ONE place.
//
// Each quest's primary teaching is its in-app micro-lesson (`lesson` in
// quests.js). These are the OPTIONAL, secondary "Go deeper" deep links shown
// below the micro-lesson — one precise resource per quest, never a homepage,
// never gating completion. The mentor page also lists three mentor-only links.
//
// Every URL below was verified to return 200 (2026-06-28). If a link dies,
// fall back to the relevant index page in MENTOR_LINKS and add a
// `// TODO verify-link` note here. Never ship a dead link.
//
// Attribution: link only — do NOT copy PrimeLessons / FLL Tutorials slide or
// video content into the app.
// ===========================================================================

const FLLT = 'https://flltutorials.com';
const PRIME = 'https://primelessons.org/en/ProgrammingLessons';

// DroidBot M (SPIKE Prime) build + attachments — reused across build quests.
const DROIDBOT_M = {
  label: 'DroidBot M build & attachments — FLL Tutorials (SPIKE Prime)',
  url: `${FLLT}/en/robotgame/building/one%20kit%20build/2020/07/06/DroidBotMSP.html`,
};

/** questId -> { label, url }. Quests not listed simply show no deep link. */
export const RESOURCES = {
  // ----- Rookie -----
  R1: DROIDBOT_M,
  R2: { label: 'SPIKE 3 Block Guide — PrimeLessons', url: `${PRIME}/SP3BlockGuide.pdf` },
  R3: { label: 'Moving Straight — PrimeLessons (SPIKE 3)', url: `${PRIME}/SP3MovingStraight.pdf` },
  R4: { label: 'Accurate Turning — PrimeLessons (SPIKE 3)', url: `${PRIME}/SP3AccurateTurning.pdf` },
  R5: {
    label: 'Guided Mission with Reliability Techniques — FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/16/Guided-Mission.html`,
  },
  R6: DROIDBOT_M,
  R7: {
    label: 'Learn the Missions (UNEARTHED) — FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Learn-the-Missions.html`,
  },
  R8: {
    label: 'Guided Mission with Reliability Techniques — FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/16/Guided-Mission.html`,
  },
  R9: DROIDBOT_M,
  R10: {
    label: 'Learn the Missions (UNEARTHED) — FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Learn-the-Missions.html`,
  },
  R11: {
    label: 'Mission Brainstorming Worksheet — FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Mission-Brainstorming.html`,
  },
  RX: { label: 'Basic Line Follower — PrimeLessons (SPIKE 3)', url: `${PRIME}/SP3LineFollower.pdf` },

  // ----- Veteran (most lean on the mentor page; only V7 has a precise link) -----
  V7: {
    label: 'Mission Brainstorming Worksheet — FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Mission-Brainstorming.html`,
  },
};

/** Mentor-only references, shown on the /mentor-resources page. */
export const MENTOR_LINKS = [
  {
    label: "UNEARTHED Coach's Guide — FLL Tutorials",
    url: `${FLLT}/en/worksheets/2020/07/17/Unofficial-Guide.html`,
  },
  { label: 'PrimeLessons — all lessons index', url: 'https://primelessons.org/en/Lessons.html' },
  { label: 'FLL Tutorials — all categories index', url: `${FLLT}/category.html` },
];

export const ATTRIBUTION =
  'Skill lessons by PrimeLessons.org (CC-BY-NC-SA). Mission tutorials by FLL Tutorials.';

export function resourceFor(questId) {
  return RESOURCES[questId] ?? null;
}
