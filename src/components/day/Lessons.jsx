import LessonCard from './LessonCard';

export default function Lessons({ lessons, lessonId }) {
  return (
    <section className="section">
      <h2 className="section__title">الدروس</h2>
      <p className="section__subtitle">
        {lessons.length} دروس — عدّل الكود وجرب مباشرة في كل درس
      </p>
      {lessons.map((lesson, i) => (
        <LessonCard key={i} lesson={lesson} index={i} lessonId={lessonId} />
      ))}
    </section>
  );
}
