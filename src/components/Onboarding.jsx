import { useState } from 'react';
import { SEASON, ROSTER_MAX } from '../state/config.js';

// First-run screen: team name + an optional roster of member names. The roster
// is informational only (no auth, no login, no gating) and can be edited later
// from the team menu.
export default function Onboarding({ onCreate }) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]); // local until the team is created
  const [draft, setDraft] = useState('');

  const trimmed = name.trim();
  const canStart = trimmed.length > 0;
  const full = members.length >= ROSTER_MAX;

  function addMember() {
    const memberName = draft.trim();
    if (!memberName || full) return;
    setMembers((list) => [...list, memberName]);
    setDraft('');
  }

  function submit(e) {
    e.preventDefault();
    if (!canStart) return;
    onCreate({ name: trimmed, members });
  }

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <form className="onboarding__card" onSubmit={submit}>
        <p className="onboarding__kicker">DBTI FLL · {SEASON}</p>
        <h1 className="onboarding__title" id="onboarding-title">
          Season Skill Hub
        </h1>
        <p className="onboarding__sub">
          Name your team and add who is on it. Everything in the hub is open from day one.
        </p>

        <label className="field">
          <span className="field__label">Team Name</span>
          <input
            className="field__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Gear Goblins"
            autoFocus
            maxLength={40}
            enterKeyHint="next"
          />
        </label>

        <fieldset className="roster-field">
          <legend className="field__label">Team Members (optional)</legend>
          <ul className="roster__list">
            {members.map((m, i) => (
              <li className="roster__row" key={`${m}-${i}`}>
                <span className="roster__name">{m}</span>
                <button
                  type="button"
                  className="roster__remove"
                  onClick={() => setMembers((list) => list.filter((_, k) => k !== i))}
                  aria-label={`Remove ${m}`}
                >
                  ✕
                </button>
              </li>
            ))}
            {members.length === 0 && (
              <li className="roster__empty">Add names one at a time — you can change this later.</li>
            )}
          </ul>
          <div className="roster__add">
            <input
              className="field__input roster__input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMember();
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
              onClick={addMember}
              disabled={!draft.trim() || full}
            >
              Add
            </button>
          </div>
        </fieldset>

        <button type="submit" className="btn btn--go btn--block" disabled={!canStart}>
          Open the Hub
        </button>
      </form>
    </div>
  );
}
