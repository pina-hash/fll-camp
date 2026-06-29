import { useState } from 'react';
import Modal from './Modal.jsx';

// Team menu: rename the team or switch track. Switching track only changes
// which ladder is active — each track's progress is stored separately and is
// never lost.
export default function Menu({
  team,
  activeLadder,
  onRename,
  onSwitchTrack,
  deviceCanCapture,
  onSetDeviceCanCapture,
  onOpenResourceLibrary,
  onOpenMentorResources,
  onClose,
}) {
  const [name, setName] = useState(team?.name ?? '');
  const trimmed = name.trim();
  const dirty = trimmed.length > 0 && trimmed !== team?.name;

  return (
    <Modal title="Team Menu" onClose={onClose} size="panel" labelId="menu-title">
      <label className="field">
        <span className="field__label">Team Name</span>
        <input
          className="field__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
        />
      </label>
      <button
        type="button"
        className="btn btn--primary btn--block"
        disabled={!dirty}
        onClick={() => onRename(trimmed)}
      >
        Save name
      </button>

      <hr className="menu__divider" />

      <p className="field__label">Track</p>
      <p className="menu__note">
        Switching keeps each track's progress separate — nothing is lost.
      </p>
      <div className="menu__tracks">
        <button
          type="button"
          className={`track-card ${activeLadder === 'rookie' ? 'track-card--on' : ''}`}
          onClick={() => onSwitchTrack('rookie')}
          aria-pressed={activeLadder === 'rookie'}
        >
          <span className="track-card__name">Rookie</span>
          <span className="track-card__desc">12 quests · 3 week-arcs</span>
        </button>
        <button
          type="button"
          className={`track-card ${activeLadder === 'veteran' ? 'track-card--on' : ''}`}
          onClick={() => onSwitchTrack('veteran')}
          aria-pressed={activeLadder === 'veteran'}
        >
          <span className="track-card__name">Veteran</span>
          <span className="track-card__desc">9 quests · Bronze → Platinum</span>
        </button>
      </div>

      <hr className="menu__divider" />

      <div className="toggle-row">
        <span className="toggle-row__label">This device can film the robot</span>
        <button
          type="button"
          role="switch"
          aria-checked={deviceCanCapture}
          className={`switch ${deviceCanCapture ? 'switch--on' : ''}`}
          onClick={() => onSetDeviceCanCapture(!deviceCanCapture)}
        >
          <span className="switch__knob" aria-hidden="true" />
        </button>
      </div>
      <p className="menu__note">
        When off, filming a clip is optional and never blocks a quest. Turn on for iPads or
        phones with a camera.
      </p>

      <hr className="menu__divider" />

      <button type="button" className="btn btn--primary btn--block" onClick={onOpenResourceLibrary}>
        Resource Library ↗
      </button>
      <button
        type="button"
        className="btn btn--ghost btn--block"
        style={{ marginTop: '0.6rem' }}
        onClick={onOpenMentorResources}
      >
        Mentor Resources ↗
      </button>
    </Modal>
  );
}
