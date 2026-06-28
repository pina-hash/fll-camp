import { useState } from 'react';

// First-run modal: capture Team Name + track. Cannot be dismissed without a
// name. The chosen track becomes the active ladder; both ladders' progress is
// always preserved separately, so switching later loses nothing.
export default function Onboarding({ onCreate }) {
  const [name, setName] = useState('');
  const [track, setTrack] = useState('rookie');

  const trimmed = name.trim();
  const canStart = trimmed.length > 0;

  function submit(e) {
    e.preventDefault();
    if (!canStart) return;
    onCreate({ name: trimmed, track });
  }

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <form className="onboarding__card" onSubmit={submit}>
        <p className="onboarding__kicker">DBTI FLL Summer Camp</p>
        <h1 className="onboarding__title" id="onboarding-title">
          Mission Hub
        </h1>
        <p className="onboarding__sub">Name your team and pick your track to start the climb.</p>

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
            enterKeyHint="go"
          />
        </label>

        <fieldset className="track-pick">
          <legend className="field__label">Choose your track</legend>
          <div className="track-pick__options">
            <button
              type="button"
              className={`track-card ${track === 'rookie' ? 'track-card--on' : ''}`}
              onClick={() => setTrack('rookie')}
              aria-pressed={track === 'rookie'}
            >
              <span className="track-card__name">Rookie</span>
              <span className="track-card__desc">Basic kit + expansion. 12 quests over 3 weeks.</span>
            </button>
            <button
              type="button"
              className={`track-card ${track === 'veteran' ? 'track-card--on' : ''}`}
              onClick={() => setTrack('veteran')}
              aria-pressed={track === 'veteran'}
            >
              <span className="track-card__name">Veteran</span>
              <span className="track-card__desc">Full LEGO. 9 quests, Bronze → Platinum.</span>
            </button>
          </div>
        </fieldset>

        <button type="submit" className="btn btn--go btn--block" disabled={!canStart}>
          Start the Climb
        </button>
      </form>
    </div>
  );
}
