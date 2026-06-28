import Modal from './Modal.jsx';

// Quest detail overlay: objective, a "How to do it" tip, and the tickable
// self-check list. Ticking every criterion completes the quest (handled in
// state) and unlocks the next. Locked quests explain how to unlock instead of
// showing ticks.
export default function QuestDetail({ quest, ladderId, status, criteria, onToggle, onClose }) {
  if (!quest) return null;
  const allTicked = quest.criteria.every((_, idx) => criteria[idx] === true);
  const locked = status === 'locked';

  return (
    <Modal
      title={`${quest.num} · ${quest.title}`}
      onClose={onClose}
      size="sheet"
      labelId="quest-detail-title"
    >
      <p className="quest-detail__objective">{quest.objective}</p>

      {locked ? (
        <div className="quest-detail__locked">
          <p className="quest-detail__locked-icon" aria-hidden="true">🔒</p>
          <p>
            {ladderId === 'veteran'
              ? 'Locked. Finish the quests before it — and clear any mentor sign-off — to open this one.'
              : 'Locked. Finish the quest before this one to open it.'}
          </p>
        </div>
      ) : (
        <>
          {quest.tip ? (
            <div className="tip">
              <span className="tip__label">How to do it</span>
              <p className="tip__text">{quest.tip}</p>
            </div>
          ) : null}

          <h3 className="quest-detail__checkhead">Self-check</h3>
          <ul className="criteria">
            {quest.criteria.map((label, idx) => {
              const checked = criteria[idx] === true;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    className={`criterion ${checked ? 'criterion--checked' : ''}`}
                    onClick={() => onToggle(idx)}
                    aria-pressed={checked}
                  >
                    <span className="criterion__box" aria-hidden="true">
                      {checked ? '✓' : ''}
                    </span>
                    <span className="criterion__label">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {allTicked ? (
            <div className="quest-detail__done">
              <span aria-hidden="true">✓</span> Quest complete — nice work!
            </div>
          ) : (
            <p className="quest-detail__hint">Tick every box to complete this quest.</p>
          )}
        </>
      )}
    </Modal>
  );
}
