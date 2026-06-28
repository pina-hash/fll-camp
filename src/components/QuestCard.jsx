// One quest in the climb. The status dot turns green on completion; the current
// frontier quest gets a "YOU ARE HERE" flag. Locked quests still open (the
// detail view explains why they're locked) so a tap is never a dead end.
export default function QuestCard({ quest, status, isCurrent, onOpen }) {
  const dotGlyph = status === 'complete' ? '✓' : status === 'locked' ? '🔒' : '';

  return (
    <button
      type="button"
      className={`quest-card quest-card--${status} ${isCurrent ? 'quest-card--current' : ''}`}
      onClick={() => onOpen(quest.id)}
    >
      <span className={`quest-card__dot dot--${status}`} aria-hidden="true">
        {dotGlyph}
      </span>
      <span className="quest-card__body">
        <span className="quest-card__num">
          {quest.num}
          {quest.optional ? ' · Optional' : ''}
        </span>
        <span className="quest-card__title">{quest.title}</span>
        <span className="quest-card__obj">{quest.objective}</span>
      </span>
      {isCurrent && status !== 'complete' && (
        <span className="quest-card__here">YOU ARE HERE</span>
      )}
    </button>
  );
}
