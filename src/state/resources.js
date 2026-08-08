// ===========================================================================
// EXTERNAL RESOURCES — the SINGLE SOURCE OF TRUTH for every external link.
//
// `RESOURCES` is keyed by a stable resource `id`. Everything that points off-app
// references an entry by id so nothing is ever duplicated:
//   - per-item "Go deeper" deep links     (item.resourceId in content.js -> resourceById)
//   - the student Resource Library page   (TOPICS + resourcesForTopic, #/resources)
//   - the mentor reference page           (MENTOR_LINK_IDS, #/mentor-resources)
//
// Each resource: { id, title, blurb, source, url, topics, audience }
//   title    kid-friendly name
//   blurb    one short line — what it helps you do
//   source   'PrimeLessons' | 'FLL Tutorials' | 'Season Build Manual'
//            (drives the source chip)
//   url      the verified deep link (never a homepage)
//   topics   browse-topic keys it appears under on the library page ([] = not browsed)
//   audience 'student' | 'mentor'
//
// Each Skill Hub item's PRIMARY teaching is its in-app lesson (`lesson` in
// content.js). These deep links are the OPTIONAL, secondary "Go deeper". The
// whole hub is free-browse: no gating, no progress, nothing locked.
//
// LINK POLICY — every URL below was fetched and returned 200 (2026-06-29). If a
// link dies, fall back to the relevant index (`prime-index` Lessons.html or
// `fllt-index` category.html) and add a `// TODO verify-link` note here. Never
// ship a dead link. Link only — never copy PrimeLessons / FLL Tutorials slide or
// video content into the app.
// ===========================================================================

const FLLT = 'https://flltutorials.com';
const PRIME = 'https://primelessons.org/en/ProgrammingLessons';

/** Vite's base path ('/fll-camp/'), with a fallback so this module can also be
 *  imported by plain Node (the static verification harness) without blowing up. */
const BASE = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/fll-camp/';

/** Assets we serve ourselves out of public/. Not external links — no link policy,
 *  no owner but us, and they ship with the build. */
export const LOCAL_ASSETS = {
  compBotManual: `${BASE}build/comp-bot-manual.pdf`,
};

/** Browse topics, in display order. `key` is referenced by each resource's
 *  `topics` array; `label` is the kid-facing band header. The closing "More"
 *  group is handled separately (resources tagged with the 'more' topic). */
export const TOPICS = [
  { key: 'new-to-fll', label: 'New to FLL?' },
  { key: 'driving', label: 'Driving & Turning' },
  { key: 'sensors', label: 'Sensors & Lines' },
  { key: 'building', label: 'Building & Attachments' },
  { key: 'missions', label: 'The Missions' },
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
    blurb: 'How to read a mission and work out what scores points.',
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

  // ---- Item-only deep links (not surfaced on the browse page) ----
  // SELF-HOSTED. Originally a Google Drive file on an account we do not control
  // (drive.google.com/file/d/18biuDIcTEnGeycvEj1K0PnMxgbRZ-bfL) — that copy was
  // downloaded on 2026-08-08 and now ships in public/build/, so this no longer
  // depends on anyone else's Drive permissions and works with no network round
  // trip to Google. It opens in-app at #/build rather than in a new tab.
  'comp-bot-manual': {
    id: 'comp-bot-manual',
    title: 'Official competition bot build manual',
    blurb: '225 steps: drivetrain, attachment motors, SPIKE Prime hub, and framing.',
    source: 'Season Build Manual',
    url: LOCAL_ASSETS.compBotManual,
    topics: [],
    audience: 'student',
  },
  'robot-designs': {
    id: 'robot-designs',
    title: 'Robot design and mechanism examples',
    blurb: 'Worked examples of gears, linkages, lifts, and grabbers.',
    source: 'PrimeLessons',
    // Shared by every item in the Mechanisms Library category: those items
    // explain what a mechanism does, this is where the worked builds live.
    url: 'https://primelessons.org/en/RobotDesigns.html',
    topics: [],
    audience: 'student',
  },
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
    title: "Coach's Guide",
    blurb: 'Season overview and coaching notes for mentors.',
    source: 'FLL Tutorials',
    url: `${FLLT}/en/worksheets/2020/07/17/Unofficial-Guide.html`,
    topics: [],
    audience: 'mentor',
  },
};

/** Resource ids shown in the mentor page's "Mentor-only references" section. */
export const MENTOR_LINK_IDS = ['coachs-guide', 'prime-index', 'fllt-index'];

// ===========================================================================
// MEDIA LIBRARY — the "Video & Resource Library" hub category.
//
// A curated jump-off list, NOT item cards: these entries carry no strategy note,
// no lesson, and no detail sheet. A compact card (title, source, topic tags,
// external link) is the whole affordance. They live here because resources.js is
// the single source of truth for every external link, but they are deliberately
// a separate export from RESOURCES: their shape differs (kind, series, multiple
// topics, no in-app item behind them) and they must never leak into
// resourceById / resourcesForTopic / mentorLinks.
//
// Entry shape:
//   id       stable key (React key only — no team data is stored against it)
//   kind     'video' | 'guide'   drives the leading marker: ▶ play vs "Guide" badge
//   title    the authored, kid-facing label (not always the raw upload title)
//   subtitle optional one line of context under the title
//   source   the creator — YouTube channel name, or PrimeLessons / FLL Tutorials
//   url      verified deep link
//   topics   MEDIA_TOPICS keys; an entry may carry more than one
//   series   optional id grouping a sequential run (see MEDIA_SERIES)
//   step     position within that series, 1-based
//
// LINK POLICY (same as RESOURCES): every URL below returned 200 on 2026-08-07 —
// the two PDFs fetched directly, the nine videos via the YouTube oEmbed endpoint.
// If one dies, replace it or drop the entry; never ship a dead link.
// ===========================================================================

/** Filter chips above the media list, in display order. Multi-select; all on by
 *  default; an entry shows if it carries ANY active topic. */
export const MEDIA_TOPICS = [
  { key: 'robot-build', label: 'Robot Build' },
  { key: 'programming-basics', label: 'Programming Basics' },
  { key: 'driving-sensors', label: 'Driving & Sensors' },
  { key: 'core-values', label: 'Core Values' },
  { key: 'innovation-project', label: 'Innovation Project' },
];

/** Sequential runs: entries sharing a `series` id build on each other and are
 *  rendered as a numbered mini-series under this header, never shuffled. */
export const MEDIA_SERIES = {
  'spike-101': {
    id: 'spike-101',
    label: 'SPIKE Prime Programming for Beginners',
    note: 'Six parts, in order — each one builds on the last.',
  },
};

/** The media library, in display order. */
export const MEDIA_ITEMS = [
  // ---- Robot Build ----
  {
    id: 'med-ultimate-robot',
    kind: 'video',
    title: '5 Simple Tips to Build the Ultimate FLL Robot',
    subtitle: "Companion video to the team's starter-bot Drive instructions.",
    source: 'Zain Khan',
    url: 'https://www.youtube.com/watch?v=4aHr97Xof34',
    topics: ['robot-build'],
  },

  // ---- Programming Basics: the SPIKE 101 series, watch in order ----
  {
    id: 'med-prog-1',
    kind: 'video',
    title: "SPIKE Prime Programming 101 — What You'll Learn & Why It Matters",
    source: 'GummyBears Robotics',
    url: 'https://www.youtube.com/watch?v=fNjZFMIFY0E',
    topics: ['programming-basics'],
    series: 'spike-101',
    step: 1,
  },
  {
    id: 'med-prog-2',
    kind: 'video',
    title: 'Setup + Block Coding Basics',
    source: 'GummyBears Robotics',
    url: 'https://www.youtube.com/watch?v=lMQ2BrV6XC4',
    topics: ['programming-basics'],
    series: 'spike-101',
    step: 2,
  },
  {
    id: 'med-prog-3',
    kind: 'video',
    title: 'Motors and DriveTrain',
    source: 'GummyBears Robotics',
    url: 'https://www.youtube.com/watch?v=fulg2fzzPDY',
    topics: ['programming-basics'],
    series: 'spike-101',
    step: 3,
  },
  {
    id: 'med-prog-4',
    kind: 'video',
    title: 'Basic Turns',
    source: 'GummyBears Robotics',
    url: 'https://www.youtube.com/watch?v=AFrqL8DzpVQ',
    topics: ['programming-basics'],
    series: 'spike-101',
    step: 4,
  },
  {
    id: 'med-prog-5',
    kind: 'video',
    title: 'Logic Statements',
    source: 'GummyBears Robotics',
    url: 'https://www.youtube.com/watch?v=2gbNfkL1JcA',
    topics: ['programming-basics'],
    series: 'spike-101',
    step: 5,
  },
  {
    id: 'med-prog-6',
    kind: 'video',
    title: 'Introduction to Sensors',
    source: 'GummyBears Robotics',
    url: 'https://www.youtube.com/watch?v=pXRrFweAZVo',
    topics: ['programming-basics'],
    series: 'spike-101',
    step: 6,
  },

  // ---- Driving & Sensors: text guides, not video ----
  {
    id: 'med-gyro-straight',
    kind: 'guide',
    title: 'Gyro Move Straight',
    subtitle: 'PDF lesson — hold a straight heading with the gyro.',
    source: 'PrimeLessons',
    url: `${PRIME}/GyroMoveStraight.pdf`,
    topics: ['driving-sensors'],
  },
  {
    id: 'med-prog-quick-guide',
    kind: 'guide',
    title: 'Programming Skills Quick Guide',
    subtitle: 'PDF — line following and aligning on a line.',
    source: 'FLL Tutorials',
    url: `${FLLT}/translations/en-us/RobotGame/ProgrammingQuickGuide.pdf`,
    topics: ['driving-sensors'],
  },

  // ---- Core Values / Innovation Project: coach-training talks ----
  {
    id: 'med-coach-workshop',
    kind: 'video',
    title: "FLL Coaches' Workshop: Innovation Project and Core Values",
    subtitle: 'General coaching content, not season-specific.',
    source: 'ASU Engineering Outreach',
    url: 'https://www.youtube.com/watch?v=9on7e7eOiBk',
    topics: ['core-values', 'innovation-project'],
  },
  {
    id: 'med-coach-training-6',
    kind: 'video',
    title: 'FLL Challenge Coach Training #6: Innovation Project, Core Values, Robot Design',
    subtitle: 'General coaching content, not season-specific.',
    source: 'High Tech Kids',
    url: 'https://www.youtube.com/watch?v=2pkFxNcE_SI',
    topics: ['core-values', 'innovation-project'],
  },
];

/** Label for a media topic key (falls back to the raw key). */
export function mediaTopicLabel(key) {
  return MEDIA_TOPICS.find((t) => t.key === key)?.label ?? key;
}

export const ATTRIBUTION =
  'Skill lessons by PrimeLessons.org (CC-BY-NC-SA). Mission tutorials by FLL Tutorials.';

/** The resource behind an item's `resourceId`, or null. Returns the canonical
 *  entry with a derived `label` for the "Go deeper" affordance. */
export function resourceById(id) {
  const res = id ? RESOURCES[id] : null;
  if (!res) return null;
  return { ...res, label: `${res.title} — ${res.source}` };
}

/** An item's deep links, PRIMARY FIRST: `resourceId`, then the optional
 *  `secondaryResourceId`. The one place item -> links is resolved, so the detail
 *  sheet and the mentor page can never disagree about what an item links to. */
export function itemResources(item) {
  return [item?.resourceId, item?.secondaryResourceId].map(resourceById).filter(Boolean);
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
