import { TOPICS, resourcesForTopic, ATTRIBUTION } from '../state/resources.js';

// Student Resource Library (route #/resources). Pure free-browse: no gating, no
// progress tracking. Topics are banded section headers (same editorial system as
// the week-arcs); under each, resource cards open the deep link in a new tab. A
// closing "More" group holds the two index pages, and a line points kids back to
// the Stuck troubleshooter. Built the same way as the /mentor-resources page.
export default function ResourceLibrary({ onBack, onOpenTroubleshooter }) {
  const more = resourcesForTopic('more');

  return (
    <div className="page">
      <header className="page__header">
        <button type="button" className="page__back" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div>
          <p className="page__kicker">DBTI FLL Summer Camp</p>
          <h1 className="page__title">Resource Library</h1>
        </div>
      </header>

      <main className="page__main">
        <p className="page__intro">
          Browse by topic. Every link opens a guide from PrimeLessons or FLL Tutorials in a new
          tab — explore whatever you like, in any order.
        </p>

        {TOPICS.map((topic) => {
          const items = resourcesForTopic(topic.key);
          if (items.length === 0) return null;
          return (
            <section className="reslist" key={topic.key}>
              <h2 className="reslist__head">{topic.label}</h2>
              <ul className="reslist__items">
                {items.map((res) => (
                  <ResourceCard key={res.id} res={res} />
                ))}
              </ul>
            </section>
          );
        })}

        {more.length > 0 && (
          <section className="reslist">
            <h2 className="reslist__head">More</h2>
            <ul className="reslist__items">
              {more.map((res) => (
                <ResourceCard key={res.id} res={res} />
              ))}
            </ul>
          </section>
        )}

        <button type="button" className="stuck-link" onClick={onOpenTroubleshooter}>
          <span className="stuck-link__icon" aria-hidden="true">🛠️</span>
          <span>
            Still stuck on the robot? Use the <strong>Stuck</strong> button.
          </span>
        </button>

        <p className="page__attribution">{ATTRIBUTION}</p>
      </main>
    </div>
  );
}

function ResourceCard({ res }) {
  return (
    <li className="rescard">
      <a className="rescard__link" href={res.url} target="_blank" rel="noopener noreferrer">
        <div className="rescard__body">
          <span className="rescard__title">{res.title}</span>
          <span className="rescard__blurb">{res.blurb}</span>
          <span className="chip chip--source">{res.source}</span>
        </div>
        <span className="rescard__go" aria-hidden="true">↗</span>
      </a>
    </li>
  );
}
