// ---------------------------------------------------------------------------
// Quest content for both ladders. This is camp content (text), not state.
// Criteria order matters: progress is keyed by criterion index.
//
//   Rookie  : 12 gated quests in 3 week-arcs + 1 optional ungated quest (RX).
//             Arcs are VISUAL groupings only — there is NO mentor sign-off in
//             the rookie ladder; quests unlock sequentially via self-check.
//   Veteran : 9 quests across 4 tiers. Tiers are gated: completing the last
//             quest of a tier requires a mentor sign-off (4-digit code) to
//             unlock the next tier. `signoffTo` marks those boundary quests.
// ---------------------------------------------------------------------------

// ---- ROOKIE LADDER --------------------------------------------------------

export const ROOKIE_QUESTS = [
  // WEEK 1 ARC — RELIABLE DRIVING
  {
    id: 'R1',
    num: 'R1',
    title: 'Build the Driving Base (review)',
    objective: 'Get a stable, standard driving base ready to roll.',
    tip: 'Rebuild only if yours is unstable; otherwise tick and move on.',
    arc: 'week1',
    criteria: [
      'Base built to the standard design',
      'Both drive motors in the correct ports',
      'Hub powers on green',
      'Both wheels spin on a motor command',
    ],
  },
  {
    id: 'R2',
    num: 'R2',
    title: 'Connect and Command (review)',
    objective: 'Pair the hub and push a program to the robot.',
    tip: 'Pair over Bluetooth or cable, then push to the hub.',
    arc: 'week1',
    criteria: [
      'Hub paired to the app',
      'A program with light, sound, and a motor spin downloaded',
      'Robot responds when you press the button',
    ],
  },
  {
    id: 'R3',
    num: 'R3',
    title: 'Drive Straight, Stop on Purpose',
    objective: 'Drive a straight line and stop exactly where you mean to.',
    tip: 'Drive by motor rotations first. Stretch: drive a measured distance in cm and stop on a line.',
    arc: 'week1',
    criteria: [
      'Robot drives straight without veering',
      'It stops where you intended',
      'Same stopping spot two runs in a row',
    ],
  },
  {
    id: 'R4',
    num: 'R4',
    title: 'Turn on Purpose',
    objective: 'Make clean, repeatable ~90° turns.',
    tip: 'Pivot by rotations first. Stretch: gyro turn within a few degrees, then chain four turns into a square that returns near start.',
    arc: 'week1',
    criteria: [
      'Robot turns about 90 degrees',
      'Same heading two of three runs',
    ],
  },
  {
    id: 'R5',
    num: 'R5',
    title: 'Lock Your Start',
    objective: 'Place the robot in the exact same home spot every time.',
    tip: 'Build a jig or use a wall and mat lines so the robot starts identically.',
    arc: 'week1',
    criteria: [
      'You have a repeatable way to place the robot in home',
      'Three identical starts in a row',
    ],
  },

  // WEEK 2 ARC — SCORE AND BUILD
  {
    id: 'R6',
    num: 'R6',
    title: 'First Attachment',
    objective: 'Mount a simple push or plow attachment that stays solid.',
    tip: 'A simple push or plow from the kit.',
    arc: 'week2',
    criteria: [
      'A push or plow attachment is mounted',
      'It is solid with no wobble',
      'Robot still drives normally with it on',
    ],
  },
  {
    id: 'R7',
    num: 'R7',
    title: 'Score Your First Mission',
    objective: 'Leave home, score M01 Surface Brushing, and return.',
    tip: 'M01 Surface Brushing, no sensors, fastest on the field.',
    arc: 'week2',
    criteria: [
      'Robot leaves home, scores M01 Surface Brushing, returns',
      'Scored and home two of three runs',
    ],
  },
  {
    id: 'R8',
    num: 'R8',
    title: 'Keep Your Tokens',
    objective: 'Run a sortie touching the robot only in home to keep all six precision tokens.',
    tip: 'Never touch the robot outside home; that keeps all six precision tokens, the easiest points on the field.',
    arc: 'week2',
    criteria: [
      'A full sortie where the robot was touched only inside home',
      'All six precision tokens kept',
    ],
  },
  {
    id: 'R9',
    num: 'R9',
    title: 'Build a Motorized Tool',
    objective: 'Use your spare motor to build an active attachment that scores.',
    tip: 'Use your spare motor for a gripper, lift, or lever.',
    arc: 'week2',
    criteria: [
      'An active attachment using the spare motor',
      'The tool moves on command',
      'It scores or moves a mission element',
    ],
  },

  // WEEK 3 ARC — CHAIN AND COMPETE
  {
    id: 'R10',
    num: 'R10',
    title: 'Chain Two Missions in One Launch',
    objective: 'Score two missions in a single launch, then return home.',
    tip: 'M01 plus M15 Site Marking or M12 Salvage, no return between.',
    arc: 'week3',
    criteria: [
      'Two missions scored in a single launch',
      'No return between them',
      'Robot returned home',
    ],
  },
  {
    id: 'R11',
    num: 'R11',
    title: 'Plan Your Run',
    objective: 'Pick and order missions with attachment swaps for the 2:30 match.',
    tip: 'Pick your missions, order them, note your attachment swaps for the 2:30 match.',
    arc: 'week3',
    criteria: [
      'Missions chosen and put in order',
      'Attachment sequence noted',
      'Plan fits the 2:30 match',
    ],
  },
  {
    id: 'R12',
    num: 'R12',
    title: 'Mock Competition Run',
    objective: 'Complete and score one full timed match run (final-day capstone).',
    tip: 'Your best scored run of the match.',
    arc: 'week3',
    criteria: ['A full timed run completed', 'Run scored'],
  },
];

// Optional, ungated quest. Unlocks after R4, does NOT block progression.
export const ROOKIE_OPTIONAL = [
  {
    id: 'RX',
    num: 'RX',
    title: 'Square Up on a Line (Color Sensor)',
    objective: 'Use the color sensor to square up on a line and reset position.',
    tip: 'Drive until a line to reset position before an approach. The one sensor skill worth your time.',
    optional: true,
    unlockAfter: 'R4',
    criteria: ['We tried squaring up on a line'],
  },
];

export const ROOKIE_ARCS = [
  { id: 'week1', label: 'Week 1 — Reliable Driving', questIds: ['R1', 'R2', 'R3', 'R4', 'R5'] },
  { id: 'week2', label: 'Week 2 — Score and Build', questIds: ['R6', 'R7', 'R8', 'R9'] },
  { id: 'week3', label: 'Week 3 — Chain and Compete', questIds: ['R10', 'R11', 'R12'] },
];

// ---- VETERAN LADDER -------------------------------------------------------

export const VETERAN_QUESTS = [
  // BRONZE — reliable simple points
  {
    id: 'V1',
    num: 'V1',
    title: 'Lock Your Start',
    objective: 'Build a repeatable home launch you can hit every time.',
    tip: '',
    tier: 'bronze',
    criteria: ['Repeatable home launch built', 'Three identical starts in a row'],
  },
  {
    id: 'V2',
    num: 'V2',
    title: 'Bank the Tokens',
    objective: 'Run a clean sortie and keep all six precision tokens.',
    tip: '',
    tier: 'bronze',
    criteria: ['Clean sortie, robot touched only in home', 'All six precision tokens kept'],
  },
  {
    id: 'V3',
    num: 'V3',
    title: 'Three Reliable Missions',
    objective: 'Score three different missions reliably, two of three runs each.',
    tip: '',
    tier: 'bronze',
    signoffTo: 'silver',
    criteria: [
      'Mission A scored two of three',
      'Mission B scored two of three',
      'Mission C scored two of three',
    ],
  },

  // SILVER — chaining and attachments
  {
    id: 'V4',
    num: 'V4',
    title: 'One Trip, Two Missions',
    objective: 'Score two missions in a single launch and return home.',
    tip: '',
    tier: 'silver',
    criteria: ['Two missions scored in one launch', 'Robot returned home'],
  },
  {
    id: 'V5',
    num: 'V5',
    title: 'Swap Discipline',
    objective: 'Run a multi-mission sortie with zero on-field attachment changes.',
    tip: '',
    tier: 'silver',
    criteria: [
      'A multi-mission sortie planned',
      'Run completed with zero attachment changes on the field',
    ],
  },
  {
    id: 'V6',
    num: 'V6',
    title: 'Take a 30-Pointer',
    objective: 'Score a 30-point mission reliably.',
    tip: 'M05 Who Lived Here, M13 Statue Rebuild, or M07 Heavy Lifting.',
    tier: 'silver',
    signoffTo: 'gold',
    criteria: ['A 30-point mission scored', 'Scored two of three'],
  },

  // GOLD — sortie planning
  {
    id: 'V7',
    num: 'V7',
    title: 'Plan the Match',
    objective: 'Write an ordered match plan with sorties, missions, swaps, and time budget.',
    tip: '',
    tier: 'gold',
    criteria: [
      'Ordered sorties written',
      'Missions per launch listed',
      'Attachment sequence set',
      'Time budget for the 2:30 match noted',
    ],
  },
  {
    id: 'V8',
    num: 'V8',
    title: 'Three-Mission Sortie',
    objective: 'Score three missions in one launch and return home.',
    tip: '',
    tier: 'gold',
    signoffTo: 'platinum',
    criteria: ['Three missions scored in one launch', 'Robot returned home'],
  },

  // PLATINUM — the full run
  {
    id: 'V9',
    num: 'V9',
    title: 'Full Match Run',
    objective: 'Run your full match plan end to end, twice, beating your first score.',
    tip: '',
    tier: 'platinum',
    criteria: [
      'Full plan run end to end and scored',
      'Run completed a second time',
      'Closed with M14 Forum last',
      'Second score beats the first',
    ],
  },
];

export const VETERAN_TIERS = [
  { id: 'bronze', label: 'Bronze', sub: 'Reliable simple points', colorVar: '--bronze', questIds: ['V1', 'V2', 'V3'] },
  { id: 'silver', label: 'Silver', sub: 'Chaining and attachments', colorVar: '--silver', questIds: ['V4', 'V5', 'V6'] },
  { id: 'gold', label: 'Gold', sub: 'Sortie planning', colorVar: '--gold-medal', questIds: ['V7', 'V8'] },
  { id: 'platinum', label: 'Platinum', sub: 'The full run', colorVar: '--platinum', questIds: ['V9'] },
];

// ---- LOOKUP HELPERS -------------------------------------------------------

/** All quests for a ladder, including the optional one(s). */
export function allQuests(ladderId) {
  return ladderId === 'veteran'
    ? VETERAN_QUESTS
    : [...ROOKIE_QUESTS, ...ROOKIE_OPTIONAL];
}

/** The ordered, gated quests (excludes optional) — drives unlock sequencing. */
export function gatedQuests(ladderId) {
  return ladderId === 'veteran' ? VETERAN_QUESTS : ROOKIE_QUESTS;
}

export function optionalQuests(ladderId) {
  return ladderId === 'veteran' ? [] : ROOKIE_OPTIONAL;
}

const QUEST_INDEX = {
  rookie: Object.fromEntries([...ROOKIE_QUESTS, ...ROOKIE_OPTIONAL].map((q) => [q.id, q])),
  veteran: Object.fromEntries(VETERAN_QUESTS.map((q) => [q.id, q])),
};

export function getQuest(ladderId, questId) {
  return QUEST_INDEX[ladderId]?.[questId] ?? null;
}
