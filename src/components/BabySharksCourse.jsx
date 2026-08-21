import {
  resourceById,
  babySharksCourses,
  coursePageUrl,
  BABY_SHARKS_LESSON_INDEX,
  BABY_SHARKS_FEEDBACK_URL,
} from '../state/resources.js';

// The Baby Sharks (FTC Team 33574) course library, with each course's lesson
// index so a student can jump straight to the lesson they need instead of
// scrolling a 50+ page PDF.
//
// ONE component, ONE data source, rendered in TWO places — never fork it:
//   variant="home"    a primary block at the top of the hub, above the tabs.
//                     Shows ALL THREE courses; each course's "Open" link is
//                     tappable without expanding anything (one tap from the home
//                     page), and only its lesson index collapses.
//   variant="inline"  the collapsed <details> above the Build & Programming
//                     items, where the FLL coding course is that category's
//                     primary resource. Season course ONLY — the other two are
//                     not FLL content and have no business in that tab. (default)
//
// The two optional courses must stay visibly labelled as not-season content
// wherever they appear; `badge` on each course carries that label.
export default function BabySharksCourse({ variant = 'inline' }) {
  // Every lesson row is a real link into the PDF at that lesson's page. Viewers
  // that honour `#page=` jump there; the rest open at page 1, which is why the
  // page number is also printed — that is what makes it work on an iPad.
  const lessonList = (course) => (
    <ul className="baby-sharks__lessons">
      {course.index.map((l) => (
        <li className="resrow" key={l.num}>
          <a
            className="lessonrow"
            href={coursePageUrl(course.url, l.page)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="resrow__item">
              <span className="resrow__num">{l.num}</span>
              <span className="resrow__qtitle">{l.title}</span>
            </span>
            <span className="lessonrow__page">p.&nbsp;{l.page}</span>
          </a>
          {l.note && <p className="baby-sharks__note">{l.note}</p>}
        </li>
      ))}
    </ul>
  );

  const feedback = (
    <p className="baby-sharks__feedback">
      Our teams are giving feedback on these courses —{' '}
      <a href={BABY_SHARKS_FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
        see the feedback form ↗
      </a>
    </p>
  );

  if (variant === 'home') {
    const courses = babySharksCourses();
    if (!courses.length) return null;

    return (
      <section className="homeblock">
        <div className="homeblock__head">
          <p className="homeblock__kicker">Training courses</p>
          <h2 className="homeblock__title">Baby Sharks Free Courses</h2>
        </div>
        <div className="homeblock__body">
          {courses.map((course) => (
            <article className="course" key={course.id}>
              <div className="course__head">
                <h3 className="course__title">{course.title}</h3>
                <span
                  className={`chip ${
                    course.badge === 'Season course' ? 'chip--topic' : 'chip--optional'
                  }`}
                >
                  {course.badge}
                </span>
              </div>
              <p className="course__blurb">{course.blurb}</p>

              <a
                className="deeplink deeplink--row"
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="deeplink__go">Open the course ↗</span>
                <span className="chip chip--source">{course.source}</span>
              </a>

              <details className="subfold">
                <summary className="subfold__summary">
                  <span className="subfold__label">Jump to a lesson</span>
                  <span className="subfold__hint">{course.index.length}</span>
                </summary>
                <div className="subfold__body">
                  <p className="docs__note">
                    Tap a lesson to open the course at that page. If your tablet opens the
                    PDF at the start instead, scroll to the page number shown on the right.
                  </p>
                  {lessonList(course)}
                </div>
              </details>
            </article>
          ))}

          {feedback}
        </div>
      </section>
    );
  }

  // Inline (Build & Programming): the season coding course only.
  const course = resourceById('baby-sharks-fll-coding');
  if (!course) return null;
  const seasonCourse = { ...course, index: BABY_SHARKS_LESSON_INDEX };

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

        {lessonList(seasonCourse)}
        {feedback}
      </div>
    </details>
  );
}
