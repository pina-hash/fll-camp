import { useEffect, useRef, useState } from 'react';
import { SEASON } from '../state/config.js';

// First-run site tour: a centered modal carousel over a dimmed backdrop. Six
// steps, each with a title, one or two plain sentences, and a small visual ECHO
// of a real screen element built from the app's own CSS (no images, no
// screenshots, no live-DOM highlighting). Swipeable on touch; arrows + dots +
// keyboard everywhere. `onClose` is called on Skip, X, Esc, backdrop, and the
// final "Open the hub" — App marks the tour seen on any of them.
const STEPS = [
  {
    title: 'This is your season hub',
    body: 'Everything you need for BIOGLOW lives here — the missions, the values, the project, and the robot skills. Nothing is locked.',
    echo: 'wordmark',
  },
  {
    title: 'Five categories',
    body: 'Tap a tab to switch between the Robot Game missions, Core Values, the Innovation Project, Build & Code, and the Video & Resource Library. Browse them in any order, any time.',
    echo: 'cats',
  },
  {
    title: 'Open anything',
    body: 'Every mission shows exactly what scores, what the bonus is, and what zeroes it. Tap one to read the details.',
    echo: 'mission',
  },
  {
    title: 'Write your strategy',
    body: 'Each item has a strategy notes box. Whatever your team decides, write it there — it saves as you type, and anyone on the team can edit it later. This is your season plan.',
    echo: 'notes',
  },
  {
    title: 'Stuck? Read this first',
    body: 'If the robot is acting up, tap Stuck and work the checklist before you raise your hand. Most problems are on that list.',
    echo: 'stuck',
  },
  {
    title: 'Get help, or explore',
    body: "Tap Request a Mentor when you need a person. Tap Resource Library any time to dig into how-tos. That's it — go build.",
    echo: 'help',
  },
];

export default function SiteTour({ onClose }) {
  const [i, setI] = useState(0);
  const last = STEPS.length - 1;
  const touchX = useRef(null);

  const next = () => setI((n) => Math.min(last, n + 1));
  const back = () => setI((n) => Math.max(0, n - 1));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') back();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, last]);

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -40) next();
    else if (dx > 40) back();
    touchX.current = null;
  }

  const step = STEPS[i];

  return (
    <div className="modal tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="tour__panel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="tour__top">
          <button type="button" className="tour__skip" onClick={onClose}>
            Skip
          </button>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close tour">
            ✕
          </button>
        </div>

        <div className="tour__echo" aria-hidden="true">
          <Echo kind={step.echo} />
        </div>

        <h2 className="tour__title" id="tour-title">
          {step.title}
        </h2>
        <p className="tour__body">{step.body}</p>

        <div className="tour__dots" role="tablist" aria-label="Tour progress">
          {STEPS.map((_, k) => (
            <button
              key={k}
              type="button"
              className={`tour__dot ${k === i ? 'tour__dot--on' : ''}`}
              aria-label={`Step ${k + 1} of ${STEPS.length}`}
              aria-selected={k === i}
              onClick={() => setI(k)}
            />
          ))}
        </div>

        <div className="tour__nav">
          <button type="button" className="btn btn--ghost" onClick={back} disabled={i === 0}>
            Back
          </button>
          {i === last ? (
            <button type="button" className="btn btn--go" onClick={onClose}>
              Open the hub
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={next}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Small echoes of real elements, assembled from the app's existing CSS tokens
// and class names. Deliberately static — they only need to *look* like the thing.
function Echo({ kind }) {
  switch (kind) {
    case 'wordmark':
      return (
        <div className="echo-band">
          <span className="echo-band__kicker">DBTI FLL · {SEASON}</span>
          <span className="echo-band__word">Season Skill Hub</span>
        </div>
      );
    case 'cats':
      return (
        <div className="cat-tabs echo-cats">
          <span className="cat-tab cat-tab--on">
            <span className="cat-tab__icon">🤖</span>
            <span className="cat-tab__label">Missions</span>
          </span>
          <span className="cat-tab">
            <span className="cat-tab__icon">🤝</span>
            <span className="cat-tab__label">Core Values</span>
          </span>
          <span className="cat-tab">
            <span className="cat-tab__icon">🌱</span>
            <span className="cat-tab__label">Project</span>
          </span>
        </div>
      );
    case 'mission':
      return (
        <div className="mcard echo-mcard">
          <span className="mcard__badge">M08</span>
          <span className="mcard__body">
            <span className="mcard__titlerow">
              <span className="mcard__title">Tangled</span>
              <span className="mcard__pts">30</span>
            </span>
            <span className="mcard__desc">Get the vine touching the mat.</span>
          </span>
          <span className="mcard__go">›</span>
        </div>
      );
    case 'notes':
      return (
        <div className="echo-notes">
          <span className="echo-notes__label">Team Strategy Notes</span>
          <span className="echo-textline">
            <span />
            <span />
          </span>
        </div>
      );
    case 'stuck':
      return <span className="fab fab--stuck echo-fab">🛠️ Stuck?</span>;
    case 'help':
      return (
        <div className="echo-help">
          <span className="fab fab--mentor echo-fab">✋ Request a Mentor</span>
          <span className="echo-libbar">
            <span aria-hidden="true">📚</span> Resource Library
          </span>
        </div>
      );
    default:
      return null;
  }
}
