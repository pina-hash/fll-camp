import { useEffect, useRef, useState } from 'react';

// First-run site tour: a centered modal carousel over a dimmed backdrop. Six
// steps, each with a title, one or two plain sentences, and a small visual ECHO
// of a real screen element built from the app's own CSS (no images, no
// screenshots, no live-DOM highlighting). Swipeable on touch; arrows + dots +
// keyboard everywhere. `onClose` is called on Skip, X, Esc, backdrop, and the
// final "Start climbing" — App marks the tour seen on any of them.
const STEPS = [
  {
    title: 'This is your guide',
    body: "It tells you the next thing to do, one step at a time. No guessing what's next.",
    echo: 'wordmark',
  },
  {
    title: 'Follow the path',
    body: 'Your track is a ladder of quests. The glowing one that says YOU ARE HERE is your next step. Tap it to open it.',
    echo: 'disc',
  },
  {
    title: 'Learn, then do',
    body: 'Every quest has a short lesson. Read it, then go do the real thing with your robot on the field.',
    echo: 'lesson',
  },
  {
    title: 'Prove it',
    body: 'Then log what happened: tick a box, log your runs Hit or Miss, record a quick clip if your device has a camera, or type an answer. Finish every step and the next quest unlocks.',
    echo: 'gate',
  },
  {
    title: 'Stuck? Read this first',
    body: 'If the robot is acting up, tap Stuck and work the checklist before you raise your hand. Most problems are on that list.',
    echo: 'stuck',
  },
  {
    title: 'Get help, or explore',
    body: "Tap Request a Mentor when you need a person. Tap Resource Library any time to dig into how-tos. That's it. Start climbing.",
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
              Start climbing
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
          <span className="echo-band__kicker">DBTI FLL Summer Camp</span>
          <span className="echo-band__word">Mission Hub</span>
        </div>
      );
    case 'disc':
      return (
        <div className="echo-disc">
          <span className="echo-here">You are here</span>
          <span className="quest-card__disc disc--available echo-disc__disc">R1</span>
        </div>
      );
    case 'lesson':
      return (
        <div className="lesson echo-lesson">
          <span className="lesson__label">Micro-lesson</span>
          <p className="lesson__text">Read this, then go try it on the field.</p>
        </div>
      );
    case 'gate':
      return (
        <div className="echo-gate">
          <span className="echo-gate__chip">
            <span className="echo-box">✓</span>
          </span>
          <span className="echo-gate__chip">
            <span className="pip pip--hit">H</span>
            <span className="pip pip--miss">M</span>
          </span>
          <span className="echo-gate__chip echo-cam">📷</span>
          <span className="echo-gate__chip echo-textline">
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
