import { useRef, useState } from 'react';
import DailyRhythm from './DailyRhythm.jsx';

// Daily check-in page (route #/today). Roles + end-of-day reflection for the
// current local date, autosaving into team.dailyLog. Reuses the existing
// DailyRhythm reference element. Built like the other standalone pages
// (#/resources, #/mentor-resources): editorial header band + page shell.

// Role cards — copy is verbatim. `key` matches team.dailyLog[date].roles.
const ROLES = [
  {
    key: 'coder',
    label: 'Coder',
    kicker: 'Pair A · Kit 1 · Run Robot',
    job: 'You write the code and own the laptop.',
    now: "Program today's run in small pieces. Change one thing at a time and test it. Download to the hub and hand the robot to your Operator. Fix what they report, then send it again.",
  },
  {
    key: 'operator',
    label: 'Operator',
    kicker: 'Pair A · Kit 1 · Run Robot',
    job: 'You run the robot on the field.',
    now: 'Place the robot in the exact same start spot every run. Launch, then watch closely. Tell your Coder exactly what happened: did it score, where did it drift, what to fix. Log the run in the quest.',
  },
  {
    key: 'protoBuilder',
    label: 'Prototype Builder',
    kicker: 'Pair B · Kit 2 · Proto Bench',
    job: 'You build and test the attachments.',
    now: 'Build the next attachment off the field. Check that it mounts solid with no wobble. Have it ready so the run pair can swap it on fast. Keep building while they run.',
  },
  {
    key: 'planner',
    label: 'Planner',
    kicker: 'Pair B · Kit 2 · Proto Bench',
    job: 'You keep the team on the mission.',
    now: 'Read the mission and decide the approach. Pick which missions to attempt and in what order. Track what is scoring and what is not. Keep everyone aimed at the objective, not wandering.',
  },
];

export default function TodayCheckin({ entry, friendlyDate, onBack, onSetRole, onSetReflection }) {
  const [openRole, setOpenRole] = useState(null);
  const cardRefs = useRef({});

  function viewJob(key) {
    setOpenRole(key);
    // Open + bring the matching card into view.
    requestAnimationFrame(() => {
      cardRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  return (
    <div className="page">
      <header className="page__header">
        <button type="button" className="page__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <p className="page__kicker">DBTI FLL Summer Camp</p>
          <h1 className="page__title">Today</h1>
        </div>
      </header>

      <main className="page__main">
        <p className="today__date">{friendlyDate}</p>

        {/* ---- Roles ---- */}
        <section className="reslist">
          <h2 className="reslist__head">Today's Roles</h2>
          <p className="page__intro">
            Type who is doing each job today. Swap jobs day to day so everyone gets a turn.
          </p>

          <div className="role-inputs">
            {ROLES.map((r) => (
              <div className="role-row" key={r.key}>
                <label className="field role-row__field">
                  <span className="field__label">{r.label}</span>
                  <input
                    className="field__input"
                    type="text"
                    value={entry.roles[r.key] ?? ''}
                    placeholder="Name"
                    maxLength={40}
                    onChange={(e) => onSetRole(r.key, e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="role-row__view"
                  onClick={() => viewJob(r.key)}
                  aria-expanded={openRole === r.key}
                >
                  View job
                </button>
              </div>
            ))}
          </div>

          <div className="role-cards">
            {ROLES.map((r) => {
              const open = openRole === r.key;
              return (
                <article
                  key={r.key}
                  className={`role-card ${open ? 'role-card--open' : ''}`}
                  ref={(el) => {
                    cardRefs.current[r.key] = el;
                  }}
                >
                  <button
                    type="button"
                    className="role-card__head"
                    onClick={() => setOpenRole(open ? null : r.key)}
                    aria-expanded={open}
                  >
                    <span className="role-card__heading">
                      <span className="role-card__name">{r.label}</span>
                      <span className="role-card__kicker">{r.kicker}</span>
                    </span>
                    <span className="role-card__chev" aria-hidden="true">
                      {open ? '▾' : '▸'}
                    </span>
                  </button>
                  {open && (
                    <div className="role-card__body">
                      <p>
                        <strong>Your job:</strong> {r.job}
                      </p>
                      <p>
                        <strong>Right now:</strong> {r.now}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="note-box">
            Two pairs, two jobs. Pair A runs the robot on the field. Pair B builds and plans the
            next mission off the field. One robot only? All four jobs still matter, just take turns
            on the one robot.
          </div>
        </section>

        {/* ---- Rhythm (reuses the existing reference element) ---- */}
        <section className="reslist">
          <h2 className="reslist__head">Today's Rhythm</h2>
          <DailyRhythm />
        </section>

        {/* ---- Reflection ---- */}
        <section className="reslist">
          <h2 className="reslist__head">End of Day</h2>
          <label className="field">
            <span className="field__label">What worked today, and what will you fix tomorrow?</span>
            <textarea
              className="answer__input today__reflection"
              value={entry.reflection ?? ''}
              placeholder="A sentence or two is plenty."
              onChange={(e) => onSetReflection(e.target.value)}
            />
          </label>
        </section>
      </main>
    </div>
  );
}
