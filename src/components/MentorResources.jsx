import { CATEGORIES } from '../state/content.js';
import { resourceById, mentorLinks, ATTRIBUTION } from '../state/resources.js';
import { SEASON } from '../state/config.js';

// Standalone reference page (route #/mentor-resources). Maps every Skill Hub
// item that has a deep link to it, plus the mentor-only references. Linked from
// the team menu.
export default function MentorResources({ onBack }) {
  return (
    <div className="page">
      <header className="page__header">
        <button type="button" className="page__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <p className="page__kicker">DBTI FLL · {SEASON}</p>
          <h1 className="page__title">Mentor Resources</h1>
        </div>
      </header>

      <main className="page__main">
        <p className="page__intro">
          Every hub item teaches in-app. These are the deep links behind them, in one place, plus
          mentor-only references.
        </p>

        {CATEGORIES.map((cat) => {
          const linked = cat.items.filter((item) => resourceById(item.resourceId));
          if (linked.length === 0) return null;
          return (
            <section className="reslist" key={cat.id}>
              <h2 className="reslist__head">{cat.label}</h2>
              <ul className="reslist__items">
                {linked.map((item) => {
                  const res = resourceById(item.resourceId);
                  return (
                    <li key={item.id} className="resrow">
                      <div className="resrow__item">
                        <span className="resrow__num">{item.num}</span>
                        <span className="resrow__qtitle">{item.title}</span>
                      </div>
                      <a
                        className="resrow__link"
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="resrow__title">
                          {res.title} — {res.source}
                        </span>
                        <span className="resrow__go">Open ↗</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <section className="reslist">
          <h2 className="reslist__head">Mentor-only references</h2>
          <ul className="reslist__items">
            {mentorLinks().map((res) => (
              <li key={res.id} className="resrow">
                <a className="resrow__link" href={res.url} target="_blank" rel="noopener noreferrer">
                  <span className="resrow__title">{res.title} — {res.source}</span>
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
