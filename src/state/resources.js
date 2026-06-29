// ===========================================================================
// EXTERNAL RESOURCES — the SINGLE SOURCE OF TRUTH for every external link.
//
// `RESOURCES` is keyed by a stable resource `id`. Everything that points off-app
// references an entry by id so nothing is ever duplicated:
//   - per-quest "Go deeper" deep links   (QUEST_RESOURCE_IDS, resourceFor)
//   - the student Resource Library page   (TOPICS + resourcesForTopic, #/resources)
//   - the mentor reference page           (MENTOR_LINK_IDS, #/mentor-resources)
//
// Each resource: { id, title, blurb, source, url, topics, audience }
//   title    kid-friendly name
//   blurb    one short line — what it helps you do
//   source   'PrimeLessons' | 'FLL Tutorials'  (drives the source chip)
//   url      the verified deep link (never a homepage)
//   topics   browse-topic keys it appears under on the library page ([] = not browsed)
//   audience 'student' | 'mentor'
//
// Each quest's PRIMARY teaching is still its in-app micro-lesson (`lesson` in
// quests.js). These deep links are the OPTIONAL, secondary "Go deeper" — they
// never gate completion. The Resource Library is pure free-browse: no gating,
// no progress.
//
// LINK POLICY — every URL below was fetched and returned 200 (2026-06-29). If a
// link dies, fall back to the relevant index (`prime-index` Lessons.html or
// `fllt-index` category.html) and add a `// TODO verify-link` note here. Never
// ship a dead link. Link only — never copy PrimeLessons / FLL Tutorials slide or
// video content into the app.
// ===========================================================================

const FLLT = 'https://flltutorials.com';
const PRIME = 'https://primelessons.org/en/ProgrammingLessons';

/** Browse topics, in display order. `key` is referenced by each resource's
 *  `topics` array; `label` is the kid-facing band header. The closing "More"
 *  group is handled separately (resources tagged with the 'more' topic). */
export const TOPICS = [
  { key: 'new-to-fll', label: 'New to FLL?' },
  { key: 'driving', label: 'Driving & Turning' },
  { key: 'sensors', label: 'Sensors & Lines' },
  { key: 'building', label: 'Building & Attachments' },
  { key: 'missions', label: 'The Missions (UNEARTHED)' },
  { key: 'strategy', label: 'Strategy & Reliability' },
];

/** id -> resource. The one place external links live. */
export const RESOURCES = {
  'intro-fll': {
    id: 'intro-fll',
    title: 'What is FLL and how a match works',
    blurb: 'The big picture: the season, the robot game, and how scoring works.',
    source: 'FLL Tutorials',
    url: `${FLLT}/translations/en-us/Worksheets/IntrotoFLL.pdf`,
    topics: ['new-to-fll'],
    audience: 'student',
  },
  'block-guide': {
    id: 'block-guide',
    title: 'Drive straight and the basics',
    blurb: 'Your first program: the blocks that make the robot move.',
    source: 'PrimeLessons',
    url: `${PRIME}/SP3BlockGuide.pdf`,
    topics: ['driving', 'building'],
    audience: 'student',
  },
  'accurate-turning': {
    id: 'accurate-turning',
    title: 'Turn exactly 90 degrees',
    blurb: 'Make clean, repeatable turns instead of guessing.',
    source: 'PrimeLessons',
    url: `${PRIME}/SP3AccurateTurning.pdf`,
    topics: ['driving'],
    audience: 'student',
  },
  'line-follower': {
    id: 'line-follower',
    title: 'Follow a line with the color sensor',
    blurb: 'Use the color sensor to track a line across the mat.',
    source: 'PrimeLessons',
    url: `${PRIME}/SP3LineFollower.pdf`,
    topics: ['sensors'],
    audience: 'student',
  },
  'droidbot-m': {
    id: 'droidbot-m',
    title: 'Build the DroidBot training robot',
    blurb: 'A solid one-kit robot to learn on and test attachments with.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/robotgame/building/one%20kit%20build/2020/07/06/DroidBotMSP.html`,
    topics: ['building'],
    audience: 'student',
  },
  'learn-missions': {
    id: 'learn-missions',
    title: 'Learn the missions',
    blurb: 'Read each UNEARTHED mission and what scores points.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Learn-the-Missions.html`,
    topics: ['missions'],
    audience: 'student',
  },
  'mission-models': {
    id: 'mission-models',
    title: 'Build and set up the mission models',
    blurb: 'Assemble the field models and set the mat up correctly.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Mission-Model-Building-Guide.html`,
    topics: ['missions'],
    audience: 'student',
  },
  reliability: {
    id: 'reliability',
    title: 'Make your runs repeat every time',
    blurb: 'Techniques so a run that worked once works every time.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/16/Guided-Mission.html`,
    topics: ['strategy'],
    audience: 'student',
  },
  brainstorming: {
    id: 'brainstorming',
    title: 'Plan which missions to attempt',
    blurb: 'Pick the missions worth your time and put them in order.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/15/Mission-Brainstorming.html`,
    topics: ['strategy'],
    audience: 'student',
  },

  // ---- Closing "More" group: the two index pages ----
  'prime-index': {
    id: 'prime-index',
    title: 'Browse all skill lessons',
    blurb: 'Every PrimeLessons SPIKE lesson in one index.',
    source: 'PrimeLessons',
    url: 'https://primelessons.org/en/Lessons.html',
    topics: ['more'],
    audience: 'student',
  },
  'fllt-index': {
    id: 'fllt-index',
    title: 'Browse all FLL tutorials',
    blurb: 'Every FLL Tutorials guide, grouped by category.',
    source: 'FLL Tutorials',
    url: `${FLLT}/category.html`,
    topics: ['more'],
    audience: 'student',
  },

  // ---- Quest-only deep links (not surfaced on the browse page) ----
  'moving-straight': {
    id: 'moving-straight',
    title: 'Moving Straight',
    blurb: 'Tune your robot so it drives a true straight line.',
    source: 'PrimeLessons',
    url: `${PRIME}/SP3MovingStraight.pdf`,
    topics: [],
    audience: 'student',
  },

  // ---- Mentor-only references ----
  'coachs-guide': {
    id: 'coachs-guide',
    title: "UNEARTHED Coach's Guide",
    blurb: 'Season overview and coaching notes for mentors.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/17/Unofficial-Guide.html`,
    topics: [],
    audience: 'mentor',
  },
};

/** questId -> resource id. Quests not listed simply show no deep link.
 *  These map back to the exact same URLs the per-quest links used before. */
export const QUEST_RESOURCE_IDS = {
  // ----- Rookie -----
  R1: 'droidbot-m',
  R2: 'block-guide',
  R3: 'moving-straight',
  R4: 'accurate-turning',
  R5: 'reliability',
  R6: 'droidbot-m',
  R7: 'learn-missions',
  R8: 'reliability',
  R9: 'droidbot-m',
  R10: 'learn-missions',
  R11: 'brainstorming',
  RX: 'line-follower',
  // ----- Veteran (most lean on the mentor page; only V7 has a precise link) -----
  V7: 'brainstorming',
};

/** Resource ids shown in the mentor page's "Mentor-only references" section. */
export const MENTOR_LINK_IDS = ['coachs-guide', 'prime-index', 'fllt-index'];

export const ATTRIBUTION =
  'Skill lessons by PrimeLessons.org (CC-BY-NC-SA). Mission tutorials by FLL Tutorials.';

/** The deep-link resource for a quest, or null. Returns the canonical entry
 *  (with a derived `label` for the existing "Go deeper" affordance). */
export function resourceFor(questId) {
  const id = QUEST_RESOURCE_IDS[questId];
  const res = id ? RESOURCES[id] : null;
  if (!res) return null;
  return { ...res, label: `${res.title} — ${res.source}` };
}

/** Library: student resources tagged with a given topic key, in insertion order. */
export function resourcesForTopic(topicKey) {
  return Object.values(RESOURCES).filter(
    (r) => r.audience === 'student' && r.topics.includes(topicKey)
  );
}

/** The mentor page's mentor-only references, resolved to resource objects. */
export function mentorLinks() {
  return MENTOR_LINK_IDS.map((id) => RESOURCES[id]).filter(Boolean);
}
