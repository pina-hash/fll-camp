import { useState } from 'react';
import Modal from './Modal.jsx';
import { MENTOR_CODE_LENGTH } from '../state/config.js';

// Tier boundary gate. Shown when the last quest of a tier is self-checked
// complete but the next tier is still locked. A mentor types the 4-digit code
// to sign off and unlock the next tier.
export default function MentorGate({ toTier, onSubmit, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const tierLabel = toTier.charAt(0).toUpperCase() + toTier.slice(1);

  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, MENTOR_CODE_LENGTH);
    setCode(digits);
    setError(false);
  }

  function submit(e) {
    e.preventDefault();
    const ok = onSubmit(code);
    if (!ok) {
      setError(true);
      setCode('');
    }
  }

  return (
    <Modal title="Mentor Sign-Off" onClose={onClose} size="panel" labelId="mentor-gate-title">
      <p className="mentor-gate__lead">
        Great climbing! To unlock <strong>{tierLabel}</strong>, a mentor enters the sign-off code.
      </p>

      <form onSubmit={submit} className="mentor-gate__form">
        <label className="field">
          <span className="field__label">Mentor code</span>
          <input
            className={`codeinput ${error ? 'codeinput--error' : ''}`}
            type="password"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            value={code}
            onChange={handleChange}
            placeholder="••••"
            maxLength={MENTOR_CODE_LENGTH}
            autoFocus
            aria-invalid={error}
          />
        </label>

        {error && <p className="mentor-gate__error">That code isn't right. Find a mentor.</p>}

        <div className="mentor-gate__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Not yet
          </button>
          <button
            type="submit"
            className="btn btn--go"
            disabled={code.length !== MENTOR_CODE_LENGTH}
          >
            Unlock {tierLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
