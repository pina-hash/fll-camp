import {
  resourceById,
  BABY_SHARKS_LESSON_INDEX,
  BABY_SHARKS_FEEDBACK_URL,
} from '../state/resources.js';

// The Baby Sharks (FTC Team 33574) FLL Coding Course, with its lesson index so a
// student can jump straight to the lesson they need instead of scrolling a 200+
// page PDF.
//
// ONE component, ONE data source, rendered in TWO places — never fork it:
//   variant="home"    a primary block at the top of the hub, above the tabs. The
//                     course link is tappable without expanding anything (one
//                     tap from the home page); only the lesson index collapses.
//   variant="inline"  the original collapsed <details> above the Build &
//                     Programming items, where the course is the primary
//                     resource for that category. (default)
// The lesson index + feedback line are shared JSX below, so the two variants
// cannot drift apart.
export default function BabySharksCourse({ variant = 'inline' }) {
  const course = resourceById('baby-sharks-fll-coding');
  if (!course) return null;

  const lessons = (
    <>
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
    </>
  );

  const openLink = (
    <a className="deeplink" href={course.url} target="_blank" rel="noopener noreferrer">
      <span className="deeplink__go">Open the free course ↗</span>
      <span className="deeplink__label">
        {course.title} <span className="chip chip--source">{course.source}</span>
      </span>
    </a>
  );

  if (variant === 'home') {
    return (
      <section className="homeblock">
        <div className="homeblock__head">
          <p className="homeblock__kicker">Training course</p>
          <h2 className="homeblock__title">Baby Sharks Coding Course</h2>
        </div>
        <div className="homeblock__body">
          <p className="baby-sharks__blurb">{course.blurb}</p>
          {/* One-row CTA, not the stacked item-sheet deeplink: the block head
              already names the course, so the second line would only repeat it —
              and the two home blocks have to clear the fold on a phone. */}
          <a
            className="deeplink deeplink--row"
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="deeplink__go">Open the free course ↗</span>
            <span className="chip chip--source">{course.source}</span>
          </a>
          <details className="subfold">
            <summary className="subfold__summary">
              <span className="subfold__label">Lesson index — jump to a lesson</span>
              <span className="subfold__hint">{BABY_SHARKS_LESSON_INDEX.length} lessons</span>
            </summary>
            <div className="subfold__body">{lessons}</div>
          </details>
        </div>
      </section>
    );
  }

  return (
    <details className="baby-sharks">
      <summary className="baby-sharks__summary">
        <span className="baby-sharks__title">{course.title}</span>
        <span className="baby-sharks__hint">tap for the lesson index</span>
      </summary>

      <div className="baby-sharks__body">
        <p className="baby-sharks__blurb">{course.blurb}</p>
        {openLink}
        {lessons}
      </div>
    </details>
  );
}
