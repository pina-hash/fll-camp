// One station on the climb: a big Oswald number disc sitting on the vertical
// track, next to its quest panel. The disc fills green on completion; the
// current frontier quest gets a pulsing ring and a "YOU ARE HERE" flag.
export default function QuestCard({ quest, status, isCurrent, onOpen }) {
  const discGlyph = status === 'complete' ? '✓' : quest.num;

  return (
    <button
      type="button"
      className={`quest-card quest-card--${status} ${isCurrent ? 'quest-card--current' : ''}`}
      onClick={() => onOpen(quest.id)}
    >
      <span className={`quest-card__disc disc--${status}`} aria-hidden="true">
        {discGlyph}
      </span>
      <span className="quest-card__panel">
        <span className="quest-card__num">
          {quest.num}
          {quest.optional ? ' · Optional' : ''}
        </span>
        <span className="quest-card__title">{quest.title}</span>
        <span className="quest-card__obj">{quest.objective}</span>
        {isCurrent && status !== 'complete' && (
          <span className="quest-card__here">YOU ARE HERE</span>
        )}
      </span>
    </button>
  );
}
