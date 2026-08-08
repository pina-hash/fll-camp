import { LOCAL_ASSETS } from '../state/resources.js';
import { SEASON } from '../state/config.js';

// The competition bot build manual, embedded (route #/build). The PDF ships in
// public/build/ so this works off our own origin — no Google Drive, no account
// permissions, no second tab on the way in.
//
// <object> not <iframe>: iOS Safari's PDF handling in an iframe is unreliable
// (it has historically rendered page 1 only, or nothing), and <object> gives us
// a real fallback slot that renders when the browser declines to embed at all.
// Either way the two buttons above the viewer always work, so a team is never
// stuck looking at a blank rectangle.
export default function BuildManual({ onBack }) {
  const src = LOCAL_ASSETS.compBotManual;

  return (
    <div className="page">
      <header className="page__header">
        <button type="button" className="page__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <p className="page__kicker">DBTI FLL · {SEASON}</p>
          <h1 className="page__title">Build the Competition Bot</h1>
        </div>
      </header>

      <main className="page__main">
        <p className="page__intro">
          All 225 steps: the drivetrain, the attachment motors, the SPIKE Prime hub, and the
          framing. This is the build every team is working from this season — start at step 1 and
          work down.
        </p>

        <div className="pdfbar">
          <a className="pdfbar__btn pdfbar__btn--primary" href={src} target="_blank" rel="noopener">
            Open full screen ↗
          </a>
          <a className="pdfbar__btn" href={src} download="comp-bot-manual.pdf">
            Save to this device ⤓
          </a>
        </div>

        <object className="pdfview" data={src} type="application/pdf" aria-label="Build manual">
          <div className="pdfview__fallback">
            <p>
              This browser will not show the manual inline. Use <strong>Open full screen</strong>{' '}
              above — it is the same file, and it works everywhere.
            </p>
          </div>
        </object>

        <p className="page__footnote">
          The manual is stored inside this app, so it keeps working even if the original shared
          folder moves or is taken down.
        </p>
      </main>
    </div>
  );
}
