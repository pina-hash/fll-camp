import { useState } from 'react';
import Modal from './Modal.jsx';
import RosterEditor from './RosterEditor.jsx';

// Team menu: rename the team, edit the roster, and reach the standalone pages.
// Nothing here gates anything — the hub is open.
export default function Menu({
  team,
  onRename,
  onAddMember,
  onRemoveMember,
  onOpenToday,
  onOpenResourceLibrary,
  onOpenMentorResources,
  onOpenTour,
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

      <p className="field__label">Team Members</p>
      <RosterEditor
        members={team?.members ?? []}
        onAdd={onAddMember}
        onRemove={onRemoveMember}
      />

      <hr className="menu__divider" />

      <button type="button" className="btn btn--primary btn--block" onClick={onOpenToday}>
        Session Roles ↗
      </button>
      <button
        type="button"
        className="btn btn--primary btn--block"
        style={{ marginTop: '0.6rem' }}
        onClick={onOpenResourceLibrary}
      >
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
      <button
        type="button"
        className="btn btn--ghost btn--block"
        style={{ marginTop: '0.6rem' }}
        onClick={onOpenTour}
      >
        How This Works
      </button>
    </Modal>
  );
}
