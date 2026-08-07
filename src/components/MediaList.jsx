import { useState } from 'react';
import { MEDIA_TOPICS, MEDIA_SERIES, mediaTopicLabel } from '../state/resources.js';

// The Video & Resource Library category (kind: 'media'). Deliberately NOT the
// item-card pattern: these entries are a jump-off list, so there is no detail
// sheet, no strategy-notes box, and no team data of any kind. A compact card
// carrying title, source, topic tags and an external link is the whole thing.
//
// A row of multi-select toggle chips filters the list — all on by default, an
// entry shows if it carries ANY active topic. Sequential runs (the SPIKE 101
// series) stay grouped and numbered rather than shuffled in with the rest.
export default function MediaList({ entries }) {
  const [active, setActive] = useState(() => new Set(MEDIA_TOPICS.map((t) => t.key)));

  function toggle(key) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const visible = entries.filter((entry) => entry.topics.some((t) => active.has(t)));
  const runs = groupSeries(visible);

  return (
    <div className="medlib">
      <div className="medchips" role="group" aria-label="Filter by topic">
        {MEDIA_TOPICS.map((topic) => {
          const on = active.has(topic.key);
          return (
            <button
              key={topic.key}
              type="button"
              className={`medchip ${on ? 'medchip--on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(topic.key)}
            >
              {topic.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="medlib__empty">
          No topics selected — tap a topic chip above to see what is in the library.
        </p>
      ) : (
        <div className="medlib__list">
          {runs.map((run) =>
            run.series ? (
              <section className="medseries" key={run.series.id}>
                <h3 className="medseries__head">
                  {run.series.label}
                  <span className="medseries__note">{run.series.note}</span>
                </h3>
                <ol className="medseries__items">
                  {run.entries.map((entry) => (
                    <MediaCard key={entry.id} entry={entry} />
                  ))}
                </ol>
              </section>
            ) : (
              <ul className="medlib__items" key={run.entries[0].id}>
                {run.entries.map((entry) => (
                  <MediaCard key={entry.id} entry={entry} />
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Walk the (already filtered) list and collect consecutive entries that share a
// `series` id into one run, so a series survives filtering as a numbered block
// and loose entries stay loose. Runs are returned in list order.
function groupSeries(entries) {
  const runs = [];
  for (const entry of entries) {
    const last = runs[runs.length - 1];
    const seriesId = entry.series ?? null;
    if (last && last.seriesId === seriesId) {
      last.entries.push(entry);
    } else {
      runs.push({ seriesId, series: seriesId ? MEDIA_SERIES[seriesId] : null, entries: [entry] });
    }
  }
  return runs;
}

function MediaCard({ entry }) {
  const isGuide = entry.kind === 'guide';
  return (
    <li className="medcard">
      <a
        className="medcard__link"
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {isGuide ? (
          <span className="medcard__kind medcard__kind--guide">Guide</span>
        ) : (
          <span className="medcard__kind medcard__kind--video" aria-hidden="true">
            ▶
          </span>
        )}
        <span className="medcard__body">
          <span className="medcard__titlerow">
            {entry.step && (
              <span className="medcard__step" aria-hidden="true">
                {entry.step}
              </span>
            )}
            <span className="medcard__title">
              {entry.step && <span className="sr-only">Part {entry.step}: </span>}
              {entry.title}
            </span>
          </span>
          {entry.subtitle && <span className="medcard__sub">{entry.subtitle}</span>}
          <span className="medcard__tags">
            <span className="chip chip--source">{entry.source}</span>
            {entry.topics.map((topicKey) => (
              <span className="chip chip--topic" key={topicKey}>
                {mediaTopicLabel(topicKey)}
              </span>
            ))}
          </span>
        </span>
        <span className="medcard__go" aria-hidden="true">
          ↗
        </span>
        <span className="sr-only">{isGuide ? 'Guide' : 'Video'}, opens in a new tab</span>
      </a>
    </li>
  );
}
