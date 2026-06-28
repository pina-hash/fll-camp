// ---------------------------------------------------------------------------
// "Stuck?" troubleshooter content. Symptom checklists are an ephemeral working
// aid (not persisted) — campers work the checks one at a time before raising
// a hand. Only after every check for a symptom is ticked does the app reveal
// the "Raise your hand" / Request-a-Mentor escalation.
// ---------------------------------------------------------------------------

export const TROUBLESHOOTER_HEADER =
  'Read this before you raise your hand. Most robot problems are on this list. Work the checks for your problem one at a time.';

export const TROUBLESHOOTER_FOOTER =
  'The number one fix in robotics: change ONE thing, then test again.';

export const SYMPTOMS = [
  {
    id: 'straight',
    title: "Robot won't drive straight",
    checks: [
      'Both wheels set to the same speed in the code?',
      'Reset the gyro to 0 right before driving?',
      'Wheels rubbing the frame, spin them by hand',
      'Battery charged, a low battery weakens one side',
    ],
  },
  {
    id: 'turns',
    title: 'Turn overshoots or stops short',
    checks: [
      'Slow down before the target angle',
      'Lower the turn speed so there is less momentum',
      'Check the gyro sign, does it count up or down for this turn',
      'Low battery changes turns, charge and re-test',
    ],
  },
  {
    id: 'attachment',
    title: 'Attachment misses the model',
    checks: [
      'Same start spot every run?',
      'Square up on a wall or mat line before the approach',
      'Attachment loose or wobbling, lock it down',
      'Model built and placed exactly per instructions',
    ],
  },
  {
    id: 'inconsistent',
    title: 'Works once, fails the next run',
    checks: [
      'Start position identical every time?',
      'Battery draining between runs?',
      'Attachment shaking loose during the run?',
      'Using timers, switch to sensors and motor rotations',
    ],
  },
  {
    id: 'download',
    title: "Code won't download to the hub",
    checks: [
      'Hub on and connected, cable or Bluetooth?',
      'Correct hub selected in the SPIKE app?',
      'Unplug and replug, or toggle Bluetooth off and on',
      'Restart the app, then the hub',
    ],
  },
  {
    id: 'drift',
    title: 'Robot drifts off over a long run',
    checks: [
      'Small errors stack, add a square-up to reset partway',
      'Check wheels for dust, hair, carpet fuzz, clean them',
      'Reset the gyro after squaring on a known line',
      'Break one long drive into shorter checked segments',
    ],
  },
];
