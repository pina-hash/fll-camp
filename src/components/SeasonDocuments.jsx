import {
  SEASON_DOC_TIER1,
  SEASON_DOC_GROUPS,
  SEASON_DOCS_SOURCE_URL,
  FIRST_ATTRIBUTION,
} from '../state/resources.js';

const KIND_BADGE = { pdf: 'PDF', web: 'Web', video: 'Video' };

// One row = one document = one tap straight to the file. Never an intermediate
// landing page: every href here is the document itself.
function DocRow({ doc }) {
  return (
    <li className={`docrow ${doc.warn ? 'docrow--warn' : ''}`}>
      <a className="docrow__link" href={doc.url} target="_blank" rel="noopener noreferrer">
        <span className="docrow__body">
          <span className="docrow__title">
            {doc.warn && (
              <span className="docrow__alert" aria-hidden="true">
                ⚠
              </span>
            )}
            {doc.title}
          </span>
          {doc.note && <span className="docrow__note">{doc.note}</span>}
          {doc.warn && <span className="docrow__warn">{doc.warn}</span>}
        </span>
        <span className="docrow__kind">{KIND_BADGE[doc.kind] ?? doc.kind}</span>
      </a>
    </li>
  );
}

// The official FIRST season documents, as a primary home-page block above the
// category tabs. Tier 1 (the four documents a team needs in hand) is always
// visible; everything else sits in per-heading <details> groups so the 13 model
// books never blow the page out. Link only — we host none of this.
export default function SeasonDocuments() {
  return (
    <section className="homeblock">
      <div className="homeblock__head">
        <p className="homeblock__kicker">Official season documents</p>
        <h2 className="homeblock__title">BIOGLOW 2026–27 from FIRST</h2>
      </div>

      <div className="homeblock__body">
        <ul className="docs">
          {SEASON_DOC_TIER1.map((doc) => (
            <DocRow key={doc.id} doc={doc} />
          ))}
        </ul>

        <div className="docs__groups">
          {SEASON_DOC_GROUPS.map((group) => (
            <details className="subfold" key={group.id}>
              <summary className="subfold__summary">
                <span className="subfold__label">{group.label}</span>
                <span className="subfold__hint">{group.docs.length}</span>
              </summary>
              <div className="subfold__body">
                {group.note && <p className="docs__note">{group.note}</p>}
                <ul className="docs">
                  {group.docs.map((doc) => (
                    <DocRow key={doc.id} doc={doc} />
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>

        <p className="homeblock__attr">
          {FIRST_ATTRIBUTION}{' '}
          <a href={SEASON_DOCS_SOURCE_URL} target="_blank" rel="noopener noreferrer">
            FIRST season materials ↗
          </a>
        </p>
      </div>
    </section>
  );
}
