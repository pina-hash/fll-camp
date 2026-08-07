// ---------------------------------------------------------------------------
// SKILL HUB CONTENT — the four open categories.
//
// Nothing here is gated. Every item is browsable from day one; the only team
// data an item carries is its strategy note (state.notes[item.id]).
//
// Item shape (shared with missions.js so one card + one detail view render both):
//   id          stable key — also the strategy-note key. Never renumber.
//   num         short badge
//   title       what it is
//   description one plain line for the card
//   lesson      the in-app teaching — must stand alone, kids never need to leave
//   prompt      the question the strategy-notes box asks
//   resourceId  optional — a key in resources.js for the "Go deeper" link
// ---------------------------------------------------------------------------

import { ROBOT_GAME_ITEMS } from './missions.js';

export const CORE_VALUES_ITEMS = [
  {
    id: 'CV1',
    num: 'CV1',
    title: 'Discovery',
    description: 'We explore new skills and ideas.',
    lesson:
      'Discovery means you tried something you did not already know how to do. Every session, someone on the team should learn a thing they could not do last week — a new block, a new mechanism, a new fact about the forest. Write those down as they happen; judges ask, and nobody remembers in April.',
    prompt: 'What did someone on this team learn recently that they could not do before?',
  },
  {
    id: 'CV2',
    num: 'CV2',
    title: 'Innovation',
    description: 'We use creativity and persistence to solve problems.',
    lesson:
      'Innovation is not the first idea — it is the fourth one, after three failed. Judges want the story: what you tried, why it did not work, what you changed. A design that failed and got fixed scores better in the telling than one that worked immediately.',
    prompt: 'Name one thing you tried that failed, and what you changed because of it.',
  },
  {
    id: 'CV3',
    num: 'CV3',
    title: 'Impact',
    description: 'We apply what we learn to improve our world.',
    lesson:
      'Impact means your work left the room. Did you share the innovation project with someone outside the team? Did anyone use your idea, or give you feedback that changed it? One real conversation with a real person outside the team is worth more than ten slides.',
    prompt: 'Who outside this team has seen your work, and what did they say?',
  },
  {
    id: 'CV4',
    num: 'CV4',
    title: 'Inclusion',
    description: 'We respect each other and embrace our differences.',
    lesson:
      'Inclusion is measured at the table, not in a speech. Does everyone touch the robot? Does everyone talk to the judges? If one person always codes and one person always watches, fix that now — rotate roles, and make the quiet member the one who explains the strategy.',
    prompt: 'Who has not had a turn on the thing they want to learn? What is the plan?',
  },
  {
    id: 'CV5',
    num: 'CV5',
    title: 'Teamwork',
    description: 'We are stronger when we work together.',
    lesson:
      'Teamwork on an FLL table looks like division of labour: one pair runs the robot, one pair builds and plans, and they talk to each other. Use the roles page each session so it is decided before the arguing starts.',
    prompt: 'How do you split the work in a session? Who decides when you disagree?',
  },
  {
    id: 'CV6',
    num: 'CV6',
    title: 'Fun',
    description: 'We enjoy and celebrate what we do.',
    lesson:
      'Fun is a scored value, not a bonus. Teams that celebrate small wins keep going when a mission fails for the tenth time. Have a thing you do when a run finally lands — judges notice teams that clearly like each other.',
    prompt: 'What does this team do to celebrate? Say it out loud so it is a real thing.',
  },
  {
    id: 'CV7',
    num: 'CV7',
    title: 'Gracious Professionalism & Coopertition',
    description: 'Compete hard, treat everyone well.',
    lesson:
      'Gracious Professionalism means you compete fiercely and are kind while doing it. Coopertition means you help the team you are about to compete against — and in BIOGLOW, M07 Humongous Fungus literally pays you both for cooperating. Lend a part, share a fix, then go win.',
    prompt: 'What could you help another team with at the next event?',
  },
  {
    id: 'CV8',
    num: 'CV8',
    title: 'The Judging Session',
    description: 'What actually happens in the room.',
    lesson:
      'You get a short session with judges: you present, they ask questions, everyone on the team should speak. They ask about the robot, the project, and how you work together. The best preparation is having real examples ready — that is what every note on this page is for.',
    prompt: 'Who says what? Draft your opening two sentences here.',
  },
];

export const PROJECT_ITEMS = [
  {
    id: 'IP1',
    num: 'IP1',
    title: 'The BIOGLOW Theme: Biodiversity',
    description: 'What this season is actually about.',
    lesson:
      'BIOGLOW is about biodiversity — the web of living things in an ecosystem and what happens when parts of it disappear. The robot game mirrors it: drones surveying, seeds spreading, fungus networks connecting roots, keystone species holding a habitat together. Understanding the theme makes both the project and the mission strategy easier to explain.',
    prompt: 'In one sentence: what is biodiversity, in your own words?',
  },
  {
    id: 'IP2',
    num: 'IP2',
    title: 'Find a Real Problem',
    description: 'Pick a biodiversity problem you can actually investigate.',
    lesson:
      'A good project problem is specific and local. "Save the rainforest" is not a project; "the creek behind our school has no shade trees, so the fish are leaving" is. Look for a problem you can go and see, photograph, or ask someone about.',
    prompt: 'What problem are you taking on, and why does it matter to your community?',
  },
  {
    id: 'IP3',
    num: 'IP3',
    title: 'Research It',
    description: 'Find out what is already known — and talk to a person.',
    lesson:
      'Research means more than searching. Find out what has already been tried and why it did not fully solve the problem, then talk to someone who works on it: a biologist, a park ranger, a farmer, a teacher. One expert conversation gives you things no website has, and judges always ask who you talked to.',
    prompt: 'What did you find out, and who did you talk to? Note names and dates.',
  },
  {
    id: 'IP4',
    num: 'IP4',
    title: 'Design a Solution',
    description: 'Your idea, and why it is different.',
    lesson:
      'Your solution has to be new to you and improve on what already exists. It can be a device, a process, an app, or a plan — as long as you can explain how it works and how it is better than what people do now.',
    prompt: 'Describe your solution and what makes it different from what already exists.',
  },
  {
    id: 'IP5',
    num: 'IP5',
    title: 'Build a Model or Prototype',
    description: 'Make it real enough to show.',
    lesson:
      'A model makes an idea believable in a five-minute session. It does not have to work — a cardboard mock-up, a drawing, a slide diagram, or a LEGO build all count. What matters is that a judge can see the thing you are describing.',
    prompt: 'What will you build to show it? Who is building it, by when?',
  },
  {
    id: 'IP6',
    num: 'IP6',
    title: 'Share It',
    description: 'Get it in front of people outside the team.',
    lesson:
      'Sharing is the step teams skip and judges score. Present to a class, a local council, a shop owner, a park office — anyone affected by the problem. Then write down their feedback, and say what you changed because of it.',
    prompt: 'Who will you share with, and what feedback did you get?',
  },
  {
    id: 'IP7',
    num: 'IP7',
    title: 'Present to Judges',
    description: 'Five minutes, everyone speaks.',
    lesson:
      'The presentation is short: problem, research, solution, sharing, and what you would do next. Everyone on the team gets a speaking part. Practise it standing up, out loud, with a timer — reading from a script is the most common way teams lose the room.',
    prompt: 'Who covers which part? Write the running order here.',
  },
];

export const BUILD_ITEMS = [
  {
    id: 'BP1',
    num: 'BP1',
    title: 'A Driving Base You Can Trust',
    description: 'Stable, square, and repeatable before anything else.',
    lesson:
      'A robot is only as good as it is repeatable. Both drive motors in the ports your program expects, no flex in the frame, wheels that do not rub. If the base wobbles, every mission after it inherits that wobble — fix it here, once.',
    prompt: 'What is your base design, and what have you changed about it?',
    resourceId: 'droidbot-m',
  },
  {
    id: 'BP2',
    num: 'BP2',
    title: 'Connect and Download',
    description: 'Get a program onto the hub and confirm it arrived.',
    lesson:
      'Pair the hub over Bluetooth or a cable, then download a tiny test program — a light, a sound, and a short motor spin — so you can confirm the hub really heard you before you debug anything complicated.',
    prompt: 'Which laptop and hub are yours? Note the hub name so you stop pairing the wrong one.',
    resourceId: 'block-guide',
  },
  {
    id: 'BP3',
    num: 'BP3',
    title: 'Drive Straight, Stop on Purpose',
    description: 'Rotations repeat. Seconds do not.',
    lesson:
      'Drive straight by giving both motors the same speed for a set number of rotations — rotations repeat far better than time, because a low battery changes how far a second takes you. Convert rotations to centimetres once and write the number down.',
    prompt: 'How many rotations per centimetre on your robot? Record the number.',
    resourceId: 'moving-straight',
  },
  {
    id: 'BP4',
    num: 'BP4',
    title: 'Turn on Purpose',
    description: 'Clean, repeatable 90-degree turns.',
    lesson:
      'Turn by spinning the wheels opposite amounts for a set number of rotations, then fine-tune until you land near 90 degrees. If the robot overshoots, lower the turn speed — less momentum to carry it past the target.',
    prompt: 'What turn speed and rotation count gives you a clean 90 on this robot?',
    resourceId: 'accurate-turning',
  },
  {
    id: 'BP5',
    num: 'BP5',
    title: 'Lock Your Start',
    description: 'The same start spot, every single run.',
    lesson:
      'A run can only be reliable if it starts the same way every time. Build a simple jig, or line the robot against the wall and the mat lines, so anyone on the team can place it identically under match pressure.',
    prompt: 'Describe your start setup so any team member can set it up the same way.',
    resourceId: 'reliability',
  },
  {
    id: 'BP6',
    num: 'BP6',
    title: 'Attachments That Do Not Wobble',
    description: 'A loose attachment is the most common missed mission.',
    lesson:
      'Mount attachments so they cannot shift — braced on two points, not one. Check the robot still drives normally with it on, and that you can swap it in a couple of seconds with cold hands at a competition table.',
    prompt: 'Which attachments do you have, and which mission does each one serve?',
    resourceId: 'droidbot-m',
  },
  {
    id: 'BP7',
    num: 'BP7',
    title: 'Sensors: Square Up on a Line',
    description: 'Reset the robot mid-run so errors stop stacking.',
    lesson:
      'A colour sensor lets the robot find a line and square up against it, resetting position before a tricky approach. It is the one sensor skill worth the time: a long run drifts, and squaring up on a line wipes that drift out.',
    prompt: 'Which run drifts the most? Where could you square up mid-run?',
    resourceId: 'line-follower',
  },
  {
    id: 'BP8',
    num: 'BP8',
    title: 'Chain Missions Into One Launch',
    description: 'Fewer trips home means more time scoring.',
    lesson:
      'Chaining means scoring two or three missions in one launch without returning home. Pick missions that sit near each other on the mat and plan a path that flows between them — every trip home costs you seconds you cannot spare.',
    prompt: 'Which missions sit close enough to chain? Sketch the launch order here.',
    resourceId: 'brainstorming',
  },
  {
    id: 'BP9',
    num: 'BP9',
    title: 'Make Runs Repeat Every Time',
    description: 'Score it three times in a row, or it does not count.',
    lesson:
      'A mission you scored once is not a mission you own. Run it three times: if it lands three for three, it goes in the match plan. If it lands one for three, it is a practice item, not a competition item. Match plans built on lucky runs fall apart at the event.',
    prompt: 'Which missions are three-for-three right now? Which are not yet?',
    resourceId: 'reliability',
  },
];

/** The four open categories, in display order. */
export const CATEGORIES = [
  {
    id: 'missions',
    label: 'Robot Game Missions',
    short: 'Missions',
    icon: '🤖',
    tagline: '15 BIOGLOW missions + match basics',
    intro:
      'Every mission on the BIOGLOW table, with what scores and what zeroes it. Open one and write your team\'s strategy — the notes save on this device and anyone on the team can edit them any time.',
    items: ROBOT_GAME_ITEMS,
  },
  {
    id: 'core-values',
    label: 'Core Values',
    short: 'Core Values',
    icon: '🤝',
    tagline: 'What judges are really looking for',
    intro:
      'The values are scored, and the score comes from examples. Use the notes to collect your real examples as they happen, so you are not inventing them the night before judging.',
    items: CORE_VALUES_ITEMS,
  },
  {
    id: 'project',
    label: 'Innovation Project',
    short: 'Project',
    icon: '🌱',
    tagline: 'Biodiversity — the BIOGLOW theme',
    intro:
      'The project runs the whole season, one step at a time. Work down the list and keep your research, decisions, and feedback in the notes — this becomes your presentation.',
    items: PROJECT_ITEMS,
  },
  {
    id: 'build',
    label: 'Build & Programming',
    short: 'Build & Code',
    icon: '🛠️',
    tagline: 'The robot skills everything else needs',
    intro:
      'The skills every mission depends on. Each one has a short lesson, and most link out to a full guide from PrimeLessons or FLL Tutorials.',
    items: BUILD_ITEMS,
  },
];

// ---- lookup helpers -------------------------------------------------------

const ITEM_INDEX = Object.fromEntries(
  CATEGORIES.flatMap((cat) => cat.items.map((item) => [item.id, { ...item, categoryId: cat.id }]))
);

/** Every item across every category (flat), in display order. */
export const ALL_ITEMS = Object.values(ITEM_INDEX);

export function getItem(itemId) {
  return ITEM_INDEX[itemId] ?? null;
}

export function getCategory(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
}
