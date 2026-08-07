// Small reference element on the main screen: how a season session runs. Two
// meetings a week — Friday evening and Saturday morning. The 2:30 match length
// is the one teams plan their runs around.
const SESSIONS = [
  {
    id: 'friday',
    label: 'Friday · 4:30–6:00pm',
    rows: [
      { time: '4:30', label: 'Huddle + set roles', mins: 10 },
      { time: '4:40', label: 'Work Block 1', mins: 40 },
      { time: '5:20', label: 'Reset + regroup', mins: 10 },
      { time: '5:30', label: 'Work Block 2', mins: 25 },
      { time: '5:55', label: 'Pack up', mins: 5 },
    ],
  },
  {
    id: 'saturday',
    label: 'Saturday · 9:00–11:00am',
    rows: [
      { time: '9:00', label: 'Huddle + set roles', mins: 10 },
      { time: '9:10', label: 'Work Block 1', mins: 50 },
      { time: '10:00', label: 'Break', mins: 10 },
      { time: '10:10', label: 'Work Block 2', mins: 40 },
      { time: '10:50', label: 'Scored practice run + pack up', mins: 10 },
    ],
  },
];

export default function DailyRhythm() {
  return (
    <details className="rhythm">
      <summary className="rhythm__summary">
        <span className="rhythm__title">Session Rhythm</span>
        <span className="rhythm__hint">tap to expand · Fri + Sat</span>
      </summary>
      {SESSIONS.map((session) => (
        <div key={session.id}>
          <p className="rhythm__session">{session.label}</p>
          <ul className="rhythm__list">
            {session.rows.map((row) => (
              <li className="rhythm__row" key={row.time}>
                <span className="rhythm__time">{row.time}</span>
                <span className="rhythm__label">{row.label}</span>
                <span className="rhythm__mins">{row.mins} min</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </details>
  );
}
