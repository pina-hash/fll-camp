// Small reference element on the main screen: the camp day's schedule. The
// 2:30 match length is the one campers plan their runs around.
const SCHEDULE = [
  { time: '11:45', label: 'Huddle', mins: 5 },
  { time: '11:50', label: 'Work Block 1', mins: 55 },
  { time: '12:45', label: 'Break', mins: 15 },
  { time: '1:00', label: 'Work Block 2', mins: 45 },
  { time: '1:45', label: 'Break', mins: 15 },
  { time: '2:00', label: 'Work Block 3', mins: 30 },
  { time: '2:30', label: 'Showcase + Reset', mins: 15 },
];

export default function DailyRhythm() {
  return (
    <details className="rhythm">
      <summary className="rhythm__summary">
        <span className="rhythm__title">Daily Rhythm</span>
        <span className="rhythm__hint">tap to expand · ends 2:45</span>
      </summary>
      <ul className="rhythm__list">
        {SCHEDULE.map((row) => (
          <li className="rhythm__row" key={row.time}>
            <span className="rhythm__time">{row.time}</span>
            <span className="rhythm__label">{row.label}</span>
            <span className="rhythm__mins">{row.mins} min</span>
          </li>
        ))}
        <li className="rhythm__row rhythm__row--end">
          <span className="rhythm__time">2:45</span>
          <span className="rhythm__label">Day ends</span>
          <span className="rhythm__mins" />
        </li>
      </ul>
    </details>
  );
}
