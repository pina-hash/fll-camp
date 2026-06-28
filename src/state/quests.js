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
//
// CRITERION TYPES (Workstream A gate redesign). Each criterion is one of:
//   check    { type:'check',    label }                  tickable box
//   runlog   { type:'runlog',   label, n, pass }         log N runs, pass = hits>=pass
//   evidence { type:'evidence', media:'photo'|'video', label }   capture to IndexedDB
//   answer   { type:'answer',   label, min }             textarea, len>=min
//
// `lesson` is the in-app micro-lesson (the primary teaching; stands alone).
// Optional "Go deeper" deep links live separately in resources.js.
// ---------------------------------------------------------------------------

import { RUNLOG_N, RUNLOG_PASS, ANSWER_MIN } from './config.js';

// ---- criterion builders ---------------------------------------------------

const check = (label) => ({ type: 'check', label });
const runlog = (label, pass = RUNLOG_PASS, n = RUNLOG_N) => ({ type: 'runlog', label, n, pass });
const answer = (label, min = ANSWER_MIN) => ({ type: 'answer', label, min });
const evidence = (media, label) => ({ type: 'evidence', media, label });

// ---- ROOKIE LADDER --------------------------------------------------------

export const ROOKIE_QUESTS = [
  // WEEK 1 ARC — RELIABLE DRIVING
  {
    id: 'R1',
    num: 'R1',
    title: 'Build the Driving Base (review)',
    objective: 'Get a stable, standard driving base ready to roll.',
    lesson:
      'A driving base is only as good as it is repeatable. Make sure both motors sit in the ports your program expects and the hub powers on green. If the base is solid, snap a photo and move on — only rebuild if it wobbles or flexes.',
    arc: 'week1',
    criteria: [
      check('Base built to the standard design'),
      check('Both drive motors in the correct ports'),
      check('Hub powers on green'),
      check('Both wheels spin on a motor command'),
      evidence('photo', 'Photo of your built base'),
    ],
  },
  {
    id: 'R2',
    num: 'R2',
    title: 'Connect and Command (review)',
    objective: 'Pair the hub and push a program to the robot.',
    lesson:
      'Connect the hub to the SPIKE app over Bluetooth or a cable, then download a tiny test program. Use a light, a sound, and a short motor spin so you can confirm the hub really heard you when you press the button.',
    arc: 'week1',
    criteria: [
      check('Hub paired to the app'),
      check('A program with light, sound, and a motor spin downloaded'),
      check('Robot responds when you press the button'),
    ],
  },
  {
    id: 'R3',
    num: 'R3',
    title: 'Drive Straight, Stop on Purpose',
    objective: 'Drive a straight line and stop exactly where you mean to.',
    lesson:
      'Drive straight by giving both motors the same speed for a set number of rotations — rotations repeat far better than time. Aim to stop on the same spot twice in a row; for a challenge, convert rotations to centimeters and stop on a line.',
    arc: 'week1',
    criteria: [
      runlog('Stopped where you intended?'),
      answer('How many rotations or cm did you land on?'),
    ],
  },
  {
    id: 'R4',
    num: 'R4',
    title: 'Turn on Purpose',
    objective: 'Make clean, repeatable ~90° turns.',
    lesson:
      'Turn by spinning the wheels opposite amounts for a set number of rotations, then fine-tune until you land near 90 degrees. If the robot overshoots, lower the turn speed so there is less momentum to carry it past the target.',
    arc: 'week1',
    criteria: [
      runlog('Landed about 90 degrees?'),
      answer('What turn speed stopped the overshoot?'),
    ],
  },
  {
    id: 'R5',
    num: 'R5',
    title: 'Lock Your Start',
    objective: 'Place the robot in the exact same home spot every time.',
    lesson:
      'A run can only be reliable if it starts the same way every time. Build a simple jig, or line the robot up against a wall and the mat lines, so you can place it identically. Practice until three starts in a row look the same.',
    arc: 'week1',
    criteria: [
      answer('Describe your start setup in one line'),
      runlog('Identical start?', 3), // PASS = 3 (needs all three)
    ],
  },

  // WEEK 2 ARC — SCORE AND BUILD
  {
    id: 'R6',
    num: 'R6',
    title: 'First Attachment',
    objective: 'Mount a simple push or plow attachment that stays solid.',
    lesson:
      'Your first attachment should be simple — a push bar or plow from the kit. Mount it so it cannot wobble, and check the robot still drives normally with it on. A loose attachment is the most common cause of a missed mission.',
    arc: 'week2',
    criteria: [
      check('A push or plow attachment is mounted'),
      check('It is solid with no wobble'),
      evidence('photo', 'Photo of the attachment on the robot'),
    ],
  },
  {
    id: 'R7',
    num: 'R7',
    title: 'Score Your First Mission',
    objective: 'Leave home, score M01 Surface Brushing, and return.',
    lesson:
      'M01 Surface Brushing is the friendliest first mission: no sensors needed, just a reliable drive out, a score, and a drive home. Run it a few times and count how often you both score and get home.',
    arc: 'week2',
    criteria: [
      runlog('Scored M01 and returned home?'),
      evidence('video', 'Short clip of a scoring run'),
    ],
  },
  {
    id: 'R8',
    num: 'R8',
    title: 'Keep Your Tokens',
    objective: 'Run a sortie touching the robot only in home to keep all six precision tokens.',
    lesson:
      'The six precision tokens are the easiest points on the field — you keep them by never touching the robot outside of home. Plan a full sortie where your hands only enter home, and protect those tokens.',
    arc: 'week2',
    criteria: [
      runlog('Robot touched only inside home?'),
      answer('How many tokens did your best run keep?'),
    ],
  },
  {
    id: 'R9',
    num: 'R9',
    title: 'Build a Motorized Tool',
    objective: 'Use your spare motor to build an active attachment that scores.',
    lesson:
      'Your spare motor turns a plain pusher into an active tool — a gripper, lift, or lever. Drive it with a button or program so it moves on command, and aim it at a mission element it can actually move or score.',
    arc: 'week2',
    criteria: [
      check('An active attachment using the spare motor'),
      check('The tool moves on command'),
      evidence('video', 'Clip of the tool moving a mission element'),
    ],
  },

  // WEEK 3 ARC — CHAIN AND COMPETE
  {
    id: 'R10',
    num: 'R10',
    title: 'Chain Two Missions in One Launch',
    objective: 'Score two missions in a single launch, then return home.',
    lesson:
      'Chaining means scoring two missions in one launch without coming back home in between. Pick two that sit near each other — like M01 plus M15 or M12 — and drive a path that hits both, then returns home.',
    arc: 'week3',
    criteria: [
      runlog('Two missions scored in one launch, returned home?'),
      answer('Which two missions did you chain?'),
    ],
  },
  {
    id: 'R11',
    num: 'R11',
    title: 'Plan Your Run',
    objective: 'Pick and order missions with attachment swaps for the 2:30 match.',
    lesson:
      'A match plan is just your missions written in the order you will attempt them, with the attachment swaps noted between them. Keep it realistic: everything has to fit inside the 2:30 match clock.',
    arc: 'week3',
    criteria: [
      answer('List your missions in order'),
      answer('Note your attachment sequence'),
      check('Plan fits the 2:30 match'),
    ],
  },
  {
    id: 'R12',
    num: 'R12',
    title: 'Mock Competition Run',
    objective: 'Complete and score one full timed match run (final-day capstone).',
    lesson:
      'This is your dress rehearsal: one full timed run, scored like the real match. Do not try anything new — run your best, most practiced sequence and record the score.',
    arc: 'week3',
    criteria: [
      check('Full timed run completed'),
      answer('What was your score?'),
      evidence('video', 'Clip of your best run'),
    ],
  },
];

// Optional, ungated quest. Unlocks after R4, does NOT block progression.
export const ROOKIE_OPTIONAL = [
  {
    id: 'RX',
    num: 'RX',
    title: 'Square Up on a Line (Color Sensor)',
    objective: 'Use the color sensor to square up on a line and reset position.',
    lesson:
      'A color sensor lets the robot find a line and square up against it, resetting its position before a tricky approach. It is the one sensor skill worth your time — try it once and see how much straighter your next move lands.',
    optional: true,
    unlockAfter: 'R4',
    criteria: [check('We tried squaring up on a line')],
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
    lesson:
      'Everything downstream depends on a repeatable launch. Build a jig or use the wall and mat lines so the robot starts in exactly the same spot and heading every time. Prove it by nailing three identical starts in a row.',
    tier: 'bronze',
    criteria: [
      answer('Describe your launch setup'),
      runlog('Identical start?', 3), // PASS = 3
    ],
  },
  {
    id: 'V2',
    num: 'V2',
    title: 'Bank the Tokens',
    objective: 'Run a clean sortie and keep all six precision tokens.',
    lesson:
      'The six precision tokens are free points you only lose by touching the robot outside home. Run a clean sortie where your hands stay inside home the whole time, and bank all six.',
    tier: 'bronze',
    criteria: [runlog('Clean sortie, all six tokens kept?')],
  },
  {
    id: 'V3',
    num: 'V3',
    title: 'Three Reliable Missions',
    objective: 'Score three different missions reliably, two of three runs each.',
    lesson:
      'Pick three missions you can score reliably, not just once. Aim to land each one at least two times out of three runs — consistency here is what a Bronze sign-off is really testing.',
    tier: 'bronze',
    signoffTo: 'silver',
    criteria: [
      runlog('Mission A scored?'),
      runlog('Mission B scored?'),
      runlog('Mission C scored?'),
      answer('Which three missions?'),
    ],
  },

  // SILVER — chaining and attachments
  {
    id: 'V4',
    num: 'V4',
    title: 'One Trip, Two Missions',
    objective: 'Score two missions in a single launch and return home.',
    lesson:
      'Chaining two missions in a single launch saves the time you would waste returning home. Choose two missions on a sensible path, score both without coming back, and finish in home.',
    tier: 'silver',
    criteria: [
      runlog('Two missions in one launch, returned home?'),
      answer('Which two?'),
    ],
  },
  {
    id: 'V5',
    num: 'V5',
    title: 'Swap Discipline',
    objective: 'Run a multi-mission sortie with zero on-field attachment changes.',
    lesson:
      'Swapping attachments on the field eats your match clock. Plan a multi-mission sortie that one configuration can handle, and complete the run with zero on-field swaps.',
    tier: 'silver',
    criteria: [
      answer('Describe your multi-mission sortie plan'),
      runlog('Run completed with zero field swaps?'),
    ],
  },
  {
    id: 'V6',
    num: 'V6',
    title: 'Take a 30-Pointer',
    objective: 'Score a 30-point mission reliably.',
    lesson:
      'Thirty-point missions like M05 Who Lived Here, M13 Statue Rebuild, or M07 Heavy Lifting are worth a dedicated attachment. Build for one, then prove you can score it more than once.',
    tier: 'silver',
    signoffTo: 'gold',
    criteria: [
      runlog('30-pointer scored?'),
      answer('Which mission?'),
      evidence('video', 'Clip of the 30-point score'),
    ],
  },

  // GOLD — sortie planning
  {
    id: 'V7',
    num: 'V7',
    title: 'Plan the Match',
    objective: 'Write an ordered match plan with sorties, missions, swaps, and time budget.',
    lesson:
      'A match plan turns practice into points. Write your sorties in order, list which missions ride in each launch, set the attachment sequence, and budget the whole thing against the 2:30 clock.',
    tier: 'gold',
    criteria: [
      answer('Ordered sorties'),
      answer('Missions per launch'),
      answer('Attachment sequence'),
      answer('Time budget for the 2:30 match'),
    ],
  },
  {
    id: 'V8',
    num: 'V8',
    title: 'Three-Mission Sortie',
    objective: 'Score three missions in one launch and return home.',
    lesson:
      'Three missions in one launch is the payoff of good pathing and a versatile attachment. Sequence them so the robot flows from one to the next and still makes it home.',
    tier: 'gold',
    signoffTo: 'platinum',
    criteria: [
      runlog('Three missions in one launch, returned home?'),
      answer('Which three?'),
    ],
  },

  // PLATINUM — the full run
  {
    id: 'V9',
    num: 'V9',
    title: 'Full Match Run',
    objective: 'Run your full match plan end to end, twice, beating your first score.',
    lesson:
      'The full run ties it all together: execute your plan end to end, score it, then do it again and beat your first score. Close with M14 Forum last so your final action locks in the points.',
    tier: 'platinum',
    criteria: [
      check('Closed with M14 Forum last'),
      answer('First run score'),
      answer('Second run score (beat the first)'),
      evidence('video', 'Clip of your best full run'),
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
