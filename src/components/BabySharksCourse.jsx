import {
  resourceById,
  BABY_SHARKS_LESSON_INDEX,
  BABY_SHARKS_FEEDBACK_URL,
} from '../state/resources.js';

// Featured resource for the Build & Programming category: the Baby Sharks
// (FTC Team 33574) FLL Coding Course, with its lesson index so a student can
// jump straight to the lesson they need instead of scrolling a 200+ page PDF.
// Collapsed by default (see DailyRhythm's <details> for the same pattern).
export default function BabySharksCourse() {
  const course = resourceById('baby-sharks-fll-coding');
  if (!course) return null;

  return (
    <details className="baby-sharks">
      <summary className="baby-sharks__summary">
        <span className="baby-sharks__title">{course.title}</span>
        <span className="baby-sharks__hint">tap for the lesson index</span>
      </summary>

      <div className="baby-sharks__body">
        <p className="baby-sharks__blurb">{course.blurb}</p>

        <a className="deeplink" href={course.url} target="_blank" rel="noopener noreferrer">
          <span className="deeplink__go">Open the free course ↗</span>
          <span className="deeplink__label">
            {course.title} <span className="chip chip--source">{course.source}</span>
          </span>
        </a>

        <ul className="baby-sharks__lessons">
          {BABY_SHARKS_LESSON_INDEX.map((l) => (
            <li className="resrow" key={l.num}>
              <div className="resrow__item">
                <span className="resrow__num">{l.num}</span>
                <span className="resrow__qtitle">{l.title}</span>
              </div>
              {l.note && <p className="baby-sharks__note">{l.note}</p>}
            </li>
          ))}
        </ul>

        <p className="baby-sharks__feedback">
          Our teams are giving feedback on these courses —{' '}
          <a href={BABY_SHARKS_FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
            see the feedback form ↗
          </a>
        </p>
      </div>
    </details>
  );
}
