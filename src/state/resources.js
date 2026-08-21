// ===========================================================================
// EXTERNAL RESOURCES — the SINGLE SOURCE OF TRUTH for every external link.
//
// `RESOURCES` is keyed by a stable resource `id`. Everything that points off-app
// references an entry by id so nothing is ever duplicated:
//   - per-item "Go deeper" deep links     (item.resourceId in content.js -> resourceById)
//   - the student Resource Library page   (TOPICS + resourcesForTopic, #/resources)
//   - the mentor reference page           (MENTOR_LINK_IDS, #/mentor-resources)
//
// Each resource: { id, title, blurb, source, url, topics, audience, deeplinkLabel? }
//   title          kid-friendly name
//   blurb          one short line — what it helps you do
//   source         'PrimeLessons' | 'FLL Tutorials' | 'Season Build Manual' |
//                  'Baby Sharks (Team 33574)' (drives the source chip)
//   url            the verified deep link (never a homepage)
//   topics         browse-topic keys it appears under on the library page ([] = not browsed)
//   audience       'student' | 'mentor'
//   deeplinkLabel  optional — overrides the "Go deeper ↗" / "Also see ↗" line on an
//                  item's detail sheet (see itemResources -> MissionDetail.jsx)
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

// Baby Sharks (FTC Team 33574) shared these three free course PDFs with us
// directly; Mr. Garza has committed our teams to using them and is giving
// feedback. LINK-ONLY: never copy, mirror, or rehost their PDF content — link
// out, same as PrimeLessons / FLL Tutorials.
//
// The PDFs are hosted on a Wix "premium files" bucket. All three were fetched
// directly and returned their full expected contents (FLL Coding Course, Intro
// to Python, Basic Engineering) — verified live 2026-08-14. That bucket's
// TLS/CDN does reject automated fetches from some build environments (curl,
// headless fetch, and browser navigation all failed to connect there, while
// unrelated wixsite.com/wixstatic.com paths on the same host succeeded), which
// is bot protection, not a dead file — don't mistake a failed automated check
// on these URLs for a dead link.
const BABY_SHARKS_RIPPLE_EFFECT = 'https://team33574.wixsite.com/baby-sharks/blank-2';
const BABY_SHARKS_FLL_CODING_URL =
  'https://09e0be48-dba0-4a4d-93a7-079640fadf32.filesusr.com/ugd/e1c871_fc3d87da85384e85bbffaee4a890b2ce.pdf';
const BABY_SHARKS_PYTHON_URL =
  'https://09e0be48-dba0-4a4d-93a7-079640fadf32.filesusr.com/ugd/e1c871_4116b158b7db46a3b4d0467a7f71e08c.pdf';
const BABY_SHARKS_ENGINEERING_URL =
  'https://09e0be48-dba0-4a4d-93a7-079640fadf32.filesusr.com/ugd/e1c871_970cff19b9ad47da8d72263a262fef4b.pdf';

/** Where the team's feedback form for the Baby Sharks courses lives (embedded
 *  on their Ripple Effect page — there is no separate form URL). */
export const BABY_SHARKS_FEEDBACK_URL = BABY_SHARKS_RIPPLE_EFFECT;

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
    deeplinkLabel: 'More training designs ↗',
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

  // ---- Baby Sharks (FTC Team 33574) — free course library, shared directly ----
  // Link only, never copied. 'baby-sharks-fll-coding' is the season-relevant
  // primary resource (see its lesson index alongside Build & Programming in the
  // hub); the lesson-specific ids below point at the same PDF but exist so a
  // specific BP item's "Go deeper" line can name the exact lesson to open.
  'baby-sharks-fll-coding': {
    id: 'baby-sharks-fll-coding',
    title: 'Baby Sharks FLL Coding Course',
    // Kept location-neutral: the lesson index now renders in two places (the hub
    // home page and Build & Programming), so the blurb must not name one of them.
    blurb:
      'Free SPIKE Prime word-block course from FTC Team 33574 — beginner to advanced, with mini challenges throughout.',
    source: 'Baby Sharks (Team 33574)',
    url: BABY_SHARKS_FLL_CODING_URL,
    topics: ['driving', 'sensors', 'strategy'],
    audience: 'student',
  },
  'baby-sharks-l2-driving': {
    id: 'baby-sharks-l2-driving',
    title: 'Baby Sharks: L2 Basic Movement + L9 Gyro Straight',
    blurb: 'Driving and turning, from the Baby Sharks FLL Coding Course.',
    source: 'Baby Sharks (Team 33574)',
    url: BABY_SHARKS_FLL_CODING_URL,
    deeplinkLabel: 'Baby Sharks lesson ↗',
    topics: [],
    audience: 'student',
  },
  'baby-sharks-l5-sensors': {
    id: 'baby-sharks-l5-sensors',
    title: 'Baby Sharks: L5 Sensors + L9 Line Following',
    blurb: 'Sensors and lines, from the Baby Sharks FLL Coding Course.',
    source: 'Baby Sharks (Team 33574)',
    url: BABY_SHARKS_FLL_CODING_URL,
    deeplinkLabel: 'Baby Sharks lesson ↗',
    topics: [],
    audience: 'student',
  },
  'baby-sharks-l5-5-reliability': {
    id: 'baby-sharks-l5-5-reliability',
    title: 'Baby Sharks: L5.5 Robot Consistency + Troubleshooting',
    blurb: 'Consistency and reliability, from the Baby Sharks FLL Coding Course.',
    source: 'Baby Sharks (Team 33574)',
    url: BABY_SHARKS_FLL_CODING_URL,
    deeplinkLabel: 'Baby Sharks lesson ↗',
    topics: [],
    audience: 'student',
  },
  // Optional, NOT FLL season content — kept out of every topic band so they
  // never read as part of the season skill path. Surfaced only in the Resource
  // Library's "Extra Learning" group.
  'baby-sharks-python': {
    id: 'baby-sharks-python',
    title: 'Baby Sharks Intro to Python Course',
    blurb:
      'Optional, not FLL content. 13 lessons, variables through try/except, ending in a from-scratch project — runs free in the browser at online-python.com, no install.',
    source: 'Baby Sharks (Team 33574)',
    url: BABY_SHARKS_PYTHON_URL,
    topics: [],
    audience: 'student',
  },
  'baby-sharks-engineering': {
    id: 'baby-sharks-engineering',
    title: 'Baby Sharks Basic Engineering Course',
    blurb:
      'Optional, not FLL content. Design process, the five robot subsystems, gears and torque, simple machines, logic and pseudocode, a final design challenge, and a glossary — aimed at late elementary and middle school.',
    source: 'Baby Sharks (Team 33574)',
    url: BABY_SHARKS_ENGINEERING_URL,
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

/** Resource ids for the Resource Library's "Extra Learning" group — optional,
 *  not FLL season content, kept visibly separate from the topic bands above. */
export const EXTRA_LEARNING_IDS = ['baby-sharks-python', 'baby-sharks-engineering'];

/** The Baby Sharks FLL Coding Course's lesson index, in course order — lets a
 *  student jump straight to the lesson they need instead of scrolling the PDF.
 *  `num` matches the course's own lesson numbering (including the two half
 *  lessons, L5.5 and L8.5). */
export const BABY_SHARKS_LESSON_INDEX = [
  { num: 'L1', title: 'Getting started with SPIKE Prime', note: 'App setup, hub connection, block types' },
  { num: 'L2', title: 'Basic movement', note: 'Drive, two turning methods, rotations vs degrees' },
  { num: 'L3', title: 'Loops' },
  { num: 'L4', title: 'Conditionals' },
  { num: 'L5', title: 'Sensors', note: 'Color, distance, touch, gyro' },
  { num: 'L5.5', title: 'Robot consistency', note: 'Drift causes, hub placement' },
  { num: 'L6', title: 'Variables' },
  { num: 'L7', title: 'Operators' },
  { num: 'L8', title: 'MyBlocks', note: 'Custom blocks' },
  { num: 'L8.5', title: 'Self-adjusting code' },
  {
    num: 'L9',
    title: 'Gyro turn, line following, gyro straight',
    note: 'The three core FLL codes — each with its own troubleshooting page',
  },
  { num: 'L10', title: 'Lights and sounds' },
  { num: 'L11', title: 'Final project', note: 'Autonomous obstacle avoidance, built in six steps' },
  { num: 'L12', title: 'Conclusion' },
  { num: '★', title: 'Printable summary sheet', note: 'One-page cheat sheet at the back of the course' },
];

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

// ===========================================================================
// OFFICIAL FIRST SEASON DOCUMENTS — BIOGLOW 2026-27.
//
// The real FIRST publications for this season, surfaced as a primary block on
// the home page (SeasonDocuments.jsx). Scope is deliberately narrow: FOUNDERS
// EDITION, GRADES 4-8 (CHALLENGE) only. Our four teams are Founders Edition
// Challenge teams — do NOT add FLL Explore or Future Edition materials here.
//
// LINK ONLY. Never download, mirror, rehost, or reproduce FIRST content into
// this app — same rule as PrimeLessons / FLL Tutorials / Baby Sharks. (The one
// self-hosted PDF in this repo is the competition bot build manual, which is
// not a FIRST publication; see LOCAL_ASSETS.)
//
// Every URL below was fetched on 2026-08-20: all resolved, each PDF served with
// `application/pdf` and a `%PDF` header. The blob.core.windows.net host does
// NOT block automated fetching (unlike the Baby Sharks Wix bucket above), so a
// failure there is a REAL dead link. On a dead link, add a
// `// TODO verify-link` naming the document and point that ONE entry at
// SEASON_DOCS_SOURCE_URL — never collapse the whole block onto the index page.
//
// Doc shape: { id, title, url, kind, note?, warn? }
//   kind  'pdf' | 'web' | 'video'  — drives the small badge on the row
//   note  optional line under the title
//   warn  Tier 1 only: renders the row in the alert treatment
// ===========================================================================

const FIRST_2026 = 'https://firstinspires.blob.core.windows.net/fll/challenge/2026-27';

/** The FIRST season materials index. Footer of the season documents block only —
 *  every document above it is a direct link, so nobody has to go through here. */
export const SEASON_DOCS_SOURCE_URL =
  'https://www.firstinspires.org/resources/library/fll/season-materials';

/** Tier 1: always visible on the home page, no expand. The four documents a
 *  team actually needs in hand during the season. */
export const SEASON_DOC_TIER1 = [
  {
    id: 'sd-rgr',
    title: 'Robot Game Rulebook',
    note: 'The rules of the robot game, mission by mission.',
    url: `${FIRST_2026}/fll-challenge-bioglow-rgr.pdf`,
    kind: 'pdf',
  },
  {
    id: 'sd-rgr-interactive',
    title: 'Robot Game Rulebook — interactive version',
    note: 'The same rulebook as a browsable website, not a PDF.',
    url: `${FIRST_2026}/interactive-rgr/index.html`,
    kind: 'web',
  },
  {
    id: 'sd-updates',
    title: 'Challenge Updates',
    note: 'Last updated 8/04/26.',
    url: `${FIRST_2026}/fll-challenge-bioglow-updates.pdf`,
    kind: 'pdf',
    // The single most-missed document in FLL: it carries rule CORRECTIONS that
    // override the Rulebook, and FIRST revises it during the season. A team that
    // runs a mission by a superseded rule loses the points. Hence the alert
    // treatment — list position alone is not enough.
    warn:
      'Rule corrections that override the Rulebook. FIRST changes this file ' +
      'during the season — re-check it before every tournament.',
  },
  {
    id: 'sd-en',
    title: 'Engineering Notebook',
    note: 'Where the team records the Innovation Project and robot design.',
    url: `${FIRST_2026}/fll-challenge-bioglow-en.pdf`,
    kind: 'pdf',
  },
];

/** Model building instruction books 1-13. Generated from the URL pattern so the
 *  two-digit zero padding can never drift: ...-bi-enus-book-01.pdf ... -13.pdf */
const MODEL_BOOKS = Array.from({ length: 13 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: `sd-bi-book-${n}`,
    title: `Model ${i + 1}`,
    url: `${FIRST_2026}/fll-challenge-bioglow-bi-enus-book-${n}.pdf`,
    kind: 'pdf',
  };
});

/** Tier 2: everything else, grouped and collapsed under its heading. */
export const SEASON_DOC_GROUPS = [
  {
    id: 'sdg-rules',
    label: 'Rules and participation',
    docs: [
      {
        id: 'sd-participation',
        title: 'Participation Rules',
        url: `${FIRST_2026}/fll-challenge-bioglow-participation-rules.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-season-overview',
        title: 'Season Overview',
        url: `${FIRST_2026}/fll-challenge-bioglow-season-overview.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-tmg',
        title: 'Team Meeting Guide',
        url: `${FIRST_2026}/fll-challenge-bioglow-tmg.pdf`,
        kind: 'pdf',
      },
    ],
  },
  {
    id: 'sdg-judging',
    label: 'Judging and awards',
    docs: [
      {
        id: 'sd-rubrics-color',
        title: 'Rubrics — color',
        url: `${FIRST_2026}/fll-challenge-bioglow-rubrics-color.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-rubrics-grayscale',
        title: 'Rubrics — grayscale, for printing',
        url: `${FIRST_2026}/fll-challenge-bioglow-rubrics-grayscale.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-judging-flowchart',
        title: 'Judging Session Flow Chart',
        url: `${FIRST_2026}/fll-challenge-bioglow-judging-session-flowchart.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-awards',
        title: 'Awards',
        url: `${FIRST_2026}/fll-challenge-bioglow-awards.pdf`,
        kind: 'pdf',
      },
    ],
  },
  {
    id: 'sdg-field',
    label: 'Field and table setup',
    docs: [
      {
        id: 'sd-field-setup',
        title: 'Field Set-Up Reference Guide',
        url: `${FIRST_2026}/fll-challenge-bioglow-field-setup-reference-guide.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-table-building',
        title: 'Robot Game Table Building Instructions',
        url: `${FIRST_2026}/fll-challenge-bioglow-table-building-instructions.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-wireframe',
        title: 'Wireframe and Grid',
        url: `${FIRST_2026}/fll-challenge-bioglow-wireframe-grid.pdf`,
        kind: 'pdf',
      },
    ],
  },
  {
    id: 'sdg-models',
    label: 'Mission model building instructions (English)',
    note:
      'Sort the LEGO bags by the bag number printed on them first, then open one ' +
      'model at a time — mixing elements between models is what costs a team hours.',
    docs: [
      {
        id: 'sd-bi-eop',
        title: 'Element Overview',
        url: `${FIRST_2026}/fll-challenge-bioglow-bi-enus-eop.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-bi-prepack',
        title: 'Prepack Overview',
        url: `${FIRST_2026}/fll-challenge-bioglow-bi-enus-prepack.pdf`,
        kind: 'pdf',
      },
      ...MODEL_BOOKS,
    ],
  },
  {
    id: 'sdg-scoring',
    label: 'Scoring',
    docs: [
      {
        id: 'sd-software-scoresheet',
        title: 'Robot Game Software Scoresheet',
        url: `${FIRST_2026}/fll-challenge-bioglow-software-scoresheet.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-classpack-scoresheet',
        title: 'Class Pack Scoresheet',
        url: `${FIRST_2026}/fll-challenge-bioglow-classpack-scoresheet.pdf`,
        kind: 'pdf',
      },
      {
        id: 'sd-score-calculator',
        title: 'Online Score Calculator',
        url: 'https://eventhub.firstinspires.org/scoresheet',
        kind: 'web',
      },
    ],
  },
  {
    id: 'sdg-videos',
    label: 'Videos',
    docs: [
      {
        id: 'sd-vid-missions',
        title: 'Robot Game Missions Video',
        url: 'https://youtu.be/uhZZ8O1StiQ',
        kind: 'video',
      },
      {
        id: 'sd-vid-field-setup',
        title: 'Field Set-Up Video',
        url: 'https://youtu.be/wDan0826cn0',
        kind: 'video',
      },
      {
        id: 'sd-vid-event',
        title: 'Preparing for your Event Video',
        url: 'https://youtu.be/9TMFtLKYT6o',
        kind: 'video',
      },
    ],
  },
];

/** Credit line for the season documents block — the FIRST equivalent of
 *  ATTRIBUTION, kept separate because it names a different scope and publisher. */
export const FIRST_ATTRIBUTION =
  'Official FIRST LEGO League Challenge publications for the BIOGLOW 2026-27 ' +
  'season (Founders Edition, Grades 4-8), published by FIRST. Linked directly, ' +
  'never copied.';

export const ATTRIBUTION =
  'Skill lessons by PrimeLessons.org (CC-BY-NC-SA). Mission tutorials by FLL Tutorials. ' +
  'FLL Coding, Python, and Engineering courses by Baby Sharks — FTC Team 33574, linked with their permission, never copied.';

/** The resource behind an item's `resourceId`, or null. Returns the canonical
 *  entry with a derived `label` for the "Go deeper" affordance. */
export function resourceById(id) {
  const res = id ? RESOURCES[id] : null;
  if (!res) return null;
  return { ...res, label: `${res.title} — ${res.source}` };
}

/** Resources shown in the Resource Library's "Extra Learning" group. */
export function extraLearningResources() {
  return EXTRA_LEARNING_IDS.map((id) => RESOURCES[id]).filter(Boolean);
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
