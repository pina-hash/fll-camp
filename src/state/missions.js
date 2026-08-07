// ---------------------------------------------------------------------------
// BIOGLOW 2026–2027 Robot Game — mission content.
//
// Source: official BIOGLOW Robot Game Rulebook (released 2026-08-04). This file
// is CONTENT, not state: teams' strategy notes live in state.js keyed by the
// `id` below (notes[id]).
//
// Shape:
//   id          stable key — also the strategy-note key. Never renumber.
//   num         short badge ('M01', 'INSPECT', 'TOKENS')
//   title       mission name from the rulebook
//   pointsLabel compact points summary for the card (authored, not derived —
//               several missions score "each", and the rulebook piece counts are
//               not restated here, so no grand total is claimed anywhere)
//   description one plain-language line: what the robot has to actually do
//   scoring     [{ label, points, bonus? }] — the scoring lines, in rulebook order
//   caveats     [string] — conditions that zero or cap the score
//   prompt      the question the strategy-notes box asks this team
// ---------------------------------------------------------------------------

export const MISSIONS = [
  {
    id: 'M01',
    num: 'M01',
    title: 'Drone Survey',
    pointsLabel: '20 + 10 bonus',
    description:
      'Get the drone completely off the mat, and — for the bonus — flip the LiDAR map and put the scan marker in the survey area.',
    scoring: [
      { label: 'Drone is off the mat', points: 20 },
      { label: 'Bonus: LiDAR map flipped AND scan marker in the survey area', points: 10, bonus: true },
      ],
    caveats: [],
    prompt: 'How do you lift the drone clear? Same launch as the LiDAR map, or separate?',
  },
  {
    id: 'M02',
    num: 'M02',
    title: 'Exploding Seeds',
    pointsLabel: '10 each seed',
    description: 'Knock or pull seeds off the stalk. Every seed that comes off scores.',
    scoring: [{ label: 'Each seed off the stalk', points: 10 }],
    caveats: [],
    prompt: 'One pass or several? What shape of attachment sweeps the most seeds at once?',
  },
  {
    id: 'M03',
    num: 'M03',
    title: 'Flip the Rock',
    pointsLabel: '20 + 10 bonus',
    description:
      'Put the research flag down. Bring the rock back to your start area for the bonus.',
    scoring: [
      { label: 'Research flag is down', points: 20 },
      { label: 'Bonus: rock returned to the start area', points: 10, bonus: true },
    ],
    caveats: [],
    prompt: 'Can you carry the rock home on the same trip, or does it need its own launch?',
  },
  {
    id: 'M04',
    num: 'M04',
    title: 'Lucky Leaves',
    pointsLabel: '10, or 30 with the bonus',
    description:
      'Remove a leaf for the base points; remove the second leaf and leave the katydid where it started for the bonus.',
    scoring: [
      { label: 'One leaf removed', points: 10 },
      {
        label: 'Bonus: second leaf removed AND katydid still in its original position',
        points: 20,
        bonus: true,
      },
    ],
    caveats: ['Scores ZERO if the katydid leaves the habitat area.'],
    prompt: 'How do you take leaves without nudging the katydid? Practise this one slowly.',
  },
  {
    id: 'M05',
    num: 'M05',
    title: 'Reaching Roots',
    pointsLabel: '10 or 20',
    description: 'Extend the plant root. Partly out scores; all the way out scores double.',
    scoring: [
      { label: 'Plant root partially extended', points: 10 },
      { label: 'Plant root completely extended', points: 20 },
    ],
    caveats: ['Only one of the two scores — you get 10 OR 20, not both.'],
    prompt: 'What pushes the root all the way? Test how far "completely" really is.',
  },
  {
    id: 'M06',
    num: 'M06',
    title: 'Leafcutter Frenzy',
    pointsLabel: '10 each fragment',
    description:
      'Get leaf fragments contained with the ant touching the nest — every contained fragment scores.',
    scoring: [{ label: 'Ant touching nest AND each leaf fragment contained', points: 10 }],
    caveats: ['The ant must be touching the nest for any fragment to count.'],
    prompt: 'Where do the fragments end up? Plan the ant first, then deliver fragments.',
  },
  {
    id: 'M07',
    num: 'M07',
    title: 'Humongous Fungus',
    pointsLabel: '20 + up to two 10-pt bonuses',
    description:
      'Extend the mycelium completely. Connecting to the opposing team\'s extended root adds a bonus — and two bonuses are possible.',
    scoring: [
      { label: 'Mycelium completely extended', points: 20 },
      { label: "Bonus: connection to the opposing team's extended root", points: 10, bonus: true },
    ],
    caveats: ['Two bonuses are possible — the other team has to extend their root too.'],
    prompt: 'This one needs the other team. What do you ask them for before the match?',
  },
  {
    id: 'M08',
    num: 'M08',
    title: 'Tangled',
    pointsLabel: '30',
    description: 'Get the vine touching the mat.',
    scoring: [{ label: 'Vine touching the mat', points: 30 }],
    caveats: [],
    prompt: '30 points in one action — worth a dedicated attachment. What pulls the vine down?',
  },
  {
    id: 'M09',
    num: 'M09',
    title: 'Research Platform',
    pointsLabel: '10 + 10 + 10',
    description:
      'Three separate scores at one model: raise the platform, deploy the camera trap, and get the seed off the tree.',
    scoring: [
      { label: 'Platform raised', points: 10 },
      { label: 'Camera trap deployed', points: 10 },
      { label: 'Seed off the tree', points: 10 },
    ],
    caveats: [],
    prompt: 'Can one attachment take all three? Which order costs the least time?',
  },
  {
    id: 'M10',
    num: 'M10',
    title: 'Fragile Microhabitats',
    pointsLabel: '20',
    description: 'Get the root cover down and touching the mat.',
    scoring: [{ label: 'Root cover down / touching the mat', points: 20 }],
    caveats: [],
    prompt: 'A simple push? Check what the robot might knock on the way in.',
  },
  {
    id: 'M11',
    num: 'M11',
    title: 'Window to the Past',
    pointsLabel: '10 + 10',
    description:
      'Both habitats score separately, and only if they stay exactly where they started.',
    scoring: [
      { label: 'Spider habitat in its original position', points: 10 },
      { label: 'Snail habitat in its original position', points: 10 },
    ],
    caveats: ['Points are for NOT disturbing them — plan a path that stays clear.'],
    prompt: 'Which of your runs drives near this model? Route around it.',
  },
  {
    id: 'M12',
    num: 'M12',
    title: 'Forest Elder',
    pointsLabel: '20 + 10',
    description: 'Raise the cane so it touches the tree, and get the support tie around the post.',
    scoring: [
      { label: 'Cane fully raised and touching the tree', points: 20 },
      { label: 'Support tie around the post', points: 10 },
    ],
    caveats: [],
    prompt: 'Two different actions. Same trip, or split them across launches?',
  },
  {
    id: 'M13',
    num: 'M13',
    title: 'Keystone Species',
    pointsLabel: '30',
    description:
      'Get the keystone species onto the restoration platform with the young trees raised. All of it, or nothing.',
    scoring: [
      { label: 'Keystone species on the restoration platform AND young trees raised', points: 30 },
    ],
    caveats: ['All-or-nothing — both conditions must be true.'],
    prompt: '30 points, but strict. What is your reliable delivery method?',
  },
  {
    id: 'M14',
    num: 'M14',
    title: 'Seeds of Renewal',
    pointsLabel: '5 each, +5 each bonus',
    description:
      'Deliver seeds into the replantation station. Each seed also touching the mat scores an extra 5.',
    scoring: [
      { label: 'Each seed contained in the replantation station', points: 5 },
      { label: 'Bonus: each of those seeds also touching the mat', points: 5, bonus: true },
    ],
    caveats: [],
    prompt: 'How many seeds can you carry in one trip? Do they land flat on the mat?',
  },
  {
    id: 'M15',
    num: 'M15',
    title: 'Biocentric Architecture',
    pointsLabel: '10 + 10 + 10, + one 10-pt bonus',
    description:
      'Three building actions, plus one bonus for matching the environment to the dock (mine, city, or farm).',
    scoring: [
      { label: 'Nesting canopy raised', points: 10 },
      { label: 'Garden skylight in', points: 10 },
      { label: 'Compost hatch open / touching the mat', points: 10 },
      { label: 'Bonus: environmental match to the dock (mine / city / farm)', points: 10, bonus: true },
    ],
    caveats: ['Only ONE environmental match bonus is possible.'],
    prompt: 'Which environment are you matching, and who decides that before the match?',
  },
];

// Match-wide points that are not a mission model. Same card + notes treatment,
// because the token plan is a real strategy decision.
export const MATCH_BASICS = [
  {
    id: 'INSPECT',
    num: 'INSPECT',
    title: 'Equipment Inspection',
    pointsLabel: '20',
    description:
      'Everything you bring must fit inside one launch area and stay under 12 inches (about 30 cm) tall.',
    scoring: [
      { label: 'All equipment fits in one launch area, under 12 in height', points: 20 },
    ],
    caveats: [],
    prompt: 'List everything you bring to the table. Does it all fit? Measure it at practice.',
  },
  {
    id: 'TOKENS',
    num: 'TOKENS',
    title: 'Precision Tokens',
    pointsLabel: 'up to 50',
    description:
      'You start with 6 tokens worth 50 points. Every time you interrupt the robot outside home, you lose one. Score by how many you have left.',
    scoring: [
      { label: '6 tokens left', points: 50 },
      { label: '5 tokens left', points: 50 },
      { label: '4 tokens left', points: 35 },
      { label: '3 tokens left', points: 25 },
      { label: '2 tokens left', points: 15 },
      { label: '1 token left', points: 10 },
    ],
    caveats: ['The first interruption is free — the drop from 5 to 4 tokens is where it hurts.'],
    prompt: 'Which runs are risky enough to cost a token? Rehearse those until they are not.',
  },
];

/** Everything in the Robot Game category, in display order. */
export const ROBOT_GAME_ITEMS = [...MISSIONS, ...MATCH_BASICS];
