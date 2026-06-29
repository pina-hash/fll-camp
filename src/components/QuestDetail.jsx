import Modal from './Modal.jsx';
import Criterion from './Criterion.jsx';
import { resourceFor, ATTRIBUTION } from '../state/resources.js';

// Quest detail overlay: an in-app micro-lesson (primary teaching), an optional
// "Go deeper" deep link (secondary), then the typed self-check gate. Locked
// quests explain how to unlock instead of showing the gate.
export default function QuestDetail({ quest, ladderId, status, criteria, actions, deviceCanCapture, onClose }) {
  if (!quest) return null;
  const locked = status === 'locked';
  const complete = status === 'complete';
  const deepLink = resourceFor(quest.id);

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
          {/* Micro-lesson: the primary, stands-on-its-own teaching. */}
          <div className="lesson">
            <span className="lesson__label">Micro-lesson</span>
            <p className="lesson__text">{quest.lesson}</p>
          </div>

          {/* Optional, secondary deep link — never gates completion. Sourced
              from resources.js by id (single source of truth). */}
          {deepLink && (
            <a
              className="deeplink"
              href={deepLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="deeplink__go">Go deeper ↗</span>
              <span className="deeplink__label">
                {deepLink.title} <span className="chip chip--source">{deepLink.source}</span>
              </span>
            </a>
          )}

          <h3 className="quest-detail__checkhead">Self-check</h3>
          <ul className="criteria">
            {quest.criteria.map((def, idx) => (
              <li key={idx}>
                <Criterion
                  ladderId={ladderId}
                  questId={quest.id}
                  idx={idx}
                  def={def}
                  st={criteria[idx]}
                  actions={actions}
                  deviceCanCapture={deviceCanCapture}
                />
              </li>
            ))}
          </ul>

          {complete ? (
            <div className="quest-detail__done">
              <span aria-hidden="true">✓</span> Quest complete — nice work!
            </div>
          ) : (
            <p className="quest-detail__hint">Finish every step to complete this quest.</p>
          )}

          <p className="quest-detail__attribution">{ATTRIBUTION}</p>
        </>
      )}
    </Modal>
  );
}
