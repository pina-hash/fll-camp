// One card in the Skill Hub list — a BIOGLOW mission, or an item from any of the
// other three categories. Nothing is locked, so a card has exactly two states:
// with a strategy note, or without one.
export default function MissionCard({ item, hasNote, onOpen }) {
  return (
    <button
      type="button"
      className={`mcard ${hasNote ? 'mcard--noted' : ''}`}
      onClick={() => onOpen(item.id)}
    >
      <span className="mcard__badge" aria-hidden="true">
        {item.num}
      </span>
      <span className="mcard__body">
        <span className="mcard__titlerow">
          <span className="mcard__title">{item.title}</span>
          {item.pointsLabel && <span className="mcard__pts">{item.pointsLabel}</span>}
        </span>
        <span className="mcard__desc">{item.description}</span>
        {hasNote && (
          <span className="mcard__noteflag">
            <span aria-hidden="true">📝</span> Strategy notes saved
          </span>
        )}
      </span>
      <span className="mcard__go" aria-hidden="true">
        ›
      </span>
    </button>
  );
}
