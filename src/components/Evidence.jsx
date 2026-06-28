import { useEffect, useRef, useState } from 'react';

// Evidence criterion: capture a photo (static builds) or short video (motion /
// scoring) with the device camera. The blob is stored in IndexedDB via the
// hook; here we only show a thumbnail + Retake and surface friendly errors.
export default function Evidence({ ladderId, questId, idx, def, st, captureEvidence, getEvidenceUrl }) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const idbKey = st?.idbKey;
  const isVideo = def.media === 'video';

  // Resolve a preview URL for the stored blob; revoke it on change/unmount.
  useEffect(() => {
    let revoked = null;
    let active = true;
    if (idbKey) {
      getEvidenceUrl(idbKey).then((u) => {
        if (active && u) {
          revoked = u;
          setUrl(u);
        }
      });
    } else {
      setUrl(null);
    }
    return () => {
      active = false;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [idbKey, getEvidenceUrl]);

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setError('');
    setBusy(true);
    const res = await captureEvidence(ladderId, questId, idx, file, def.media);
    setBusy(false);
    if (!res.ok) {
      if (res.reason === 'too-big') {
        setError('That file is over 25 MB. Try a shorter video or a photo.');
      } else {
        setError('Could not save that capture. Try again.');
      }
    }
  }

  return (
    <div className={`evidence ${idbKey ? 'evidence--has' : ''}`}>
      <div className="evidence__row">
        <span className="evidence__icon" aria-hidden="true">
          {idbKey ? '✓' : isVideo ? '🎬' : '📷'}
        </span>
        <span className="evidence__label">{def.label}</span>
      </div>

      {url &&
        (isVideo ? (
          <video className="evidence__thumb" src={url} controls playsInline preload="metadata" />
        ) : (
          <img className="evidence__thumb" src={url} alt="Captured evidence" />
        ))}

      <input
        ref={inputRef}
        className="evidence__input"
        type="file"
        accept={isVideo ? 'video/*' : 'image/*'}
        capture="environment"
        onChange={onFile}
      />

      <button
        type="button"
        className={`btn ${idbKey ? 'btn--ghost' : 'btn--primary'} evidence__btn`}
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? 'Saving…' : idbKey ? 'Retake' : isVideo ? 'Record a clip' : 'Take a photo'}
      </button>

      {error && <p className="evidence__error">{error}</p>}
    </div>
  );
}
