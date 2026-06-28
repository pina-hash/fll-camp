import { useState } from 'react';
import Modal from './Modal.jsx';
import {
  SYMPTOMS,
  TROUBLESHOOTER_HEADER,
  TROUBLESHOOTER_FOOTER,
} from '../state/troubleshooter.js';

// "Stuck?" overlay. Each symptom expands to a tap-to-tick checklist. Only once
// every check for a symptom is ticked does the escalation ("Raise your hand" +
// Request a Mentor) appear — pushing campers to work the checks first.
export default function Troubleshooter({ onClose, needsMentor, onRequestMentor }) {
  const [openId, setOpenId] = useState(null);
  // ephemeral tick state: { [symptomId]: { [checkIdx]: true } }
  const [ticks, setTicks] = useState({});

  function toggleCheck(symptomId, idx) {
    setTicks((prev) => {
      const cur = { ...(prev[symptomId] ?? {}) };
      cur[idx] = !cur[idx];
      return { ...prev, [symptomId]: cur };
    });
  }

  return (
    <Modal title="Stuck?" onClose={onClose} size="sheet" labelId="troubleshooter-title">
      <p className="ts__header">{TROUBLESHOOTER_HEADER}</p>

      <div className="ts__list">
        {SYMPTOMS.map((symptom) => {
          const isOpen = openId === symptom.id;
          const symptomTicks = ticks[symptom.id] ?? {};
          const allChecked = symptom.checks.every((_, idx) => symptomTicks[idx] === true);

          return (
            <div className={`symptom ${isOpen ? 'symptom--open' : ''}`} key={symptom.id}>
              <button
                type="button"
                className="symptom__head"
                onClick={() => setOpenId(isOpen ? null : symptom.id)}
                aria-expanded={isOpen}
              >
                <span className="symptom__title">{symptom.title}</span>
                <span className="symptom__chev" aria-hidden="true">
                  {isOpen ? '▾' : '▸'}
                </span>
              </button>

              {isOpen && (
                <div className="symptom__body">
                  <ul className="checklist">
                    {symptom.checks.map((check, idx) => {
                      const checked = symptomTicks[idx] === true;
                      return (
                        <li key={idx}>
                          <button
                            type="button"
                            className={`criterion ${checked ? 'criterion--checked' : ''}`}
                            onClick={() => toggleCheck(symptom.id, idx)}
                            aria-pressed={checked}
                          >
                            <span className="criterion__box" aria-hidden="true">
                              {checked ? '✓' : ''}
                            </span>
                            <span className="criterion__label">{check}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {allChecked && (
                    <div className="symptom__escalate">
                      <p className="symptom__escalate-text">Still stuck? Raise your hand</p>
                      <button
                        type="button"
                        className={`btn ${needsMentor ? 'btn--requested' : 'btn--go'}`}
                        onClick={onRequestMentor}
                      >
                        {needsMentor ? 'Mentor requested ✓' : 'Request a Mentor'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="ts__footer">
        <strong>{TROUBLESHOOTER_FOOTER}</strong>
      </p>
    </Modal>
  );
}
