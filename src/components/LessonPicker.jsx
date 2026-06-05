export default function LessonPicker({ lessons, onSelect }) {
  return (
    <div className="lesson-picker">
      <div className="lesson-picker__hero">
        <h1>الكورس التعليمي</h1>
        <p>اختار الدرس اللي عايز تبدأ بيه. كل درس في مجلد مستقل ومحتواه منفصل.</p>
      </div>
      <div className="lesson-picker__grid">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            type="button"
            className="lesson-card"
            onClick={() => onSelect(lesson.id)}
          >
            <span className="lesson-card__badge">{lesson.badge}</span>
            <h2 className="lesson-card__title">{lesson.title}</h2>
            <p className="lesson-card__desc">{lesson.description}</p>
            <div className="lesson-card__meta">
              <span>📚 {lesson.moduleCount} أقسام</span>
              <span>📊 {lesson.level}</span>
              <span>⏱ {lesson.estimatedDuration}</span>
            </div>
          </button>
        ))}
      </div>
      {lessons.length === 0 && (
        <p className="lesson-picker__empty">لا توجد دروس بعد. أضف مجلدًا داخل lessons/</p>
      )}
    </div>
  );
}
