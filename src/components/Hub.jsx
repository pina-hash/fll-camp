import MissionCard from './MissionCard.jsx';
import { CATEGORIES } from '../state/content.js';

// The Skill Hub: four open categories, nothing locked, nothing sequential. A tab
// row picks the category; the whole category's content is listed underneath.
export default function Hub({ activeCategory, onSelectCategory, hasNote, onOpen }) {
  const category = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <div className="hub">
      <div className="cat-tabs" role="tablist" aria-label="Skill Hub categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={cat.id === category.id}
            className={`cat-tab ${cat.id === category.id ? 'cat-tab--on' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="cat-tab__icon" aria-hidden="true">
              {cat.icon}
            </span>
            <span className="cat-tab__label">{cat.short}</span>
          </button>
        ))}
      </div>

      <section className="hub-group">
        <h2 className="hub-group__head">
          {category.label}
          <span className="hub-group__tag">{category.tagline}</span>
        </h2>
        <p className="hub-group__intro">{category.intro}</p>

        <div className="hub-group__list">
          {category.items.map((item) => (
            <MissionCard
              key={item.id}
              item={item}
              hasNote={hasNote(item.id)}
              onOpen={onOpen}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
