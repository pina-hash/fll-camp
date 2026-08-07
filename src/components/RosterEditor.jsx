import { useState } from 'react';
import { ROSTER_MAX } from '../state/config.js';

// Team roster: a plain add/remove list of member names. No auth, no login, no
// gating — it is just the team seeing itself, and the seam real student accounts
// drop into once emails are provisioned. Used by Onboarding (local list, saved
// with the team) and by the Menu (live, persisted list).
export default function RosterEditor({ members, onAdd, onRemove, compact = false }) {
  const [draft, setDraft] = useState('');
  const full = members.length >= ROSTER_MAX;

  function add() {
    const name = draft.trim();
    if (!name || full) return;
    onAdd(name);
    setDraft('');
  }

  return (
    <div className="roster">
      <ul className="roster__list">
        {members.map((m) => (
          <li className="roster__row" key={m.id}>
            <span className="roster__name">{m.name}</span>
            <button
              type="button"
              className="roster__remove"
              onClick={() => onRemove(m.id)}
              aria-label={`Remove ${m.name}`}
            >
              ✕
            </button>
          </li>
        ))}
        {members.length === 0 && (
          <li className="roster__empty">No members yet — add them below.</li>
        )}
      </ul>

      <div className="roster__add">
        <input
          className="field__input roster__input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds a member without submitting the surrounding form.
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={full ? 'Roster is full' : 'Member name'}
          maxLength={40}
          disabled={full}
          enterKeyHint="done"
          aria-label="New member name"
        />
        <button
          type="button"
          className="btn btn--primary roster__addbtn"
          onClick={add}
          disabled={!draft.trim() || full}
        >
          Add
        </button>
      </div>
      {!compact && (
        <p className="menu__note">
          Just a list for your team — nothing here logs anyone in. Up to {ROSTER_MAX} members.
        </p>
      )}
    </div>
  );
}
