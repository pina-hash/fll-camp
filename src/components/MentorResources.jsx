import {
  ROOKIE_QUESTS,
  ROOKIE_OPTIONAL,
  VETERAN_QUESTS,
} from '../state/quests.js';
import { RESOURCES, MENTOR_LINKS, ATTRIBUTION } from '../state/resources.js';

// Standalone reference page (route #/mentor-resources). Maps every quest to its
// deep link, plus three mentor-only references. Linked from the team menu.
export default function MentorResources({ onBack }) {
  return (
    <div className="page">
      <header className="page__header">
        <button type="button" className="page__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <p className="page__kicker">DBTI FLL Summer Camp</p>
          <h1 className="page__title">Mentor Resources</h1>
        </div>
      </header>

      <main className="page__main">
        <p className="page__intro">
          Each quest teaches with its own in-app micro-lesson. These are the deep links behind
          them, in one place, plus mentor-only references.
        </p>

        <QuestList title="Rookie Track" quests={[...ROOKIE_QUESTS, ...ROOKIE_OPTIONAL]} />
        <QuestList title="Veteran Track" quests={VETERAN_QUESTS} />

        <section className="reslist">
          <h2 className="reslist__head">Mentor-only references</h2>
          <ul className="reslist__items">
            {MENTOR_LINKS.map((link) => (
              <li key={link.url} className="resrow">
                <a className="resrow__link" href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="resrow__title">{link.label}</span>
                  <span className="resrow__go">Open ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="page__attribution">{ATTRIBUTION}</p>
      </main>
    </div>
  );
}

function QuestList({ title, quests }) {
  return (
    <section className="reslist">
      <h2 className="reslist__head">{title}</h2>
      <ul className="reslist__items">
        {quests.map((q) => {
          const res = RESOURCES[q.id];
          return (
            <li key={q.id} className="resrow">
              <div className="resrow__quest">
                <span className="resrow__num">{q.num}</span>
                <span className="resrow__qtitle">{q.title}</span>
              </div>
              {res ? (
                <a className="resrow__link" href={res.url} target="_blank" rel="noopener noreferrer">
                  <span className="resrow__title">{res.label}</span>
                  <span className="resrow__go">Open ↗</span>
                </a>
              ) : (
                <span className="resrow__none">In-app micro-lesson · uses the mentor references</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
