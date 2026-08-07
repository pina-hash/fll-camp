import Modal from './Modal.jsx';
import { resourceById, ATTRIBUTION } from '../state/resources.js';

// Detail sheet for any Skill Hub item. Missions show their scoring breakdown;
// skill items show their in-app lesson. Both end in the same thing: the team's
// strategy notes, free text, autosaved, editable by anyone on the team at any
// time. There is no gate, no completion, and nothing to unlock.
export default function MissionDetail({ item, note, onSetNote, onClose }) {
  if (!item) return null;
  const deepLink = resourceById(item.resourceId);

  return (
    <Modal
      title={`${item.num} · ${item.title}`}
      onClose={onClose}
      size="sheet"
      labelId="mission-detail-title"
    >
      <p className="mdetail__desc">{item.description}</p>

      {item.lesson && (
        <div className="lesson">
          <span className="lesson__label">Lesson</span>
          <p className="lesson__text">{item.lesson}</p>
        </div>
      )}

      {item.scoring?.length > 0 && (
        <>
          <h3 className="mdetail__head">Scoring</h3>
          <ul className="scoring">
            {item.scoring.map((line, idx) => (
              <li className={`scoring__row ${line.bonus ? 'scoring__row--bonus' : ''}`} key={idx}>
                <span className="scoring__label">{line.label}</span>
                <span className="scoring__pts">
                  {line.bonus ? '+' : ''}
                  {line.points}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {item.caveats?.length > 0 && (
        <ul className="caveats">
          {item.caveats.map((c, idx) => (
            <li className="caveat" key={idx}>
              <span aria-hidden="true">⚠️</span> {c}
            </li>
          ))}
        </ul>
      )}

      {deepLink && (
        <a className="deeplink" href={deepLink.url} target="_blank" rel="noopener noreferrer">
          <span className="deeplink__go">Go deeper ↗</span>
          <span className="deeplink__label">
            {deepLink.title} <span className="chip chip--source">{deepLink.source}</span>
          </span>
        </a>
      )}

      <h3 className="mdetail__head">Team Strategy Notes</h3>
      <p className="mdetail__prompt">{item.prompt}</p>
      <textarea
        className="answer__input notes__input"
        value={note}
        placeholder="Write what your team decided. Anyone can edit this, any time."
        onChange={(e) => onSetNote(e.target.value)}
        aria-label={`Strategy notes for ${item.title}`}
      />
      <p className="notes__hint">Saves as you type, on this device.</p>

      <p className="mdetail__attribution">{ATTRIBUTION}</p>
    </Modal>
  );
}
