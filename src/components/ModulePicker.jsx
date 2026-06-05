import LearningPath from './LearningPath';

function moduleBadge(mod) {
  if (mod.isExam) return 'اختبار نهائي';
  if (mod.type === 'projects-workshop') return 'ورشة مشاريع';
  return 'يوم تعليمي';
}

export default function ModulePicker({ lesson, onSelect, onBack }) {
  return (
    <div className="day-picker">
      <div className="day-picker__hero">
        <button type="button" className="day-picker__back" onClick={onBack}>
          ← كل الدروس
        </button>
        <span className="day-picker__lesson-badge">{lesson.badge}</span>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
      </div>
      <LearningPath steps={lesson.learningPath} />
      <div className="day-picker__grid">
        {lesson.modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            className={`module-card ${mod.isExam ? 'module-card--exam' : ''}`}
            onClick={() => onSelect(mod.id)}
          >
            <span className="module-card__badge">{moduleBadge(mod)}</span>
            <h2 className="module-card__title">{mod.data.title}</h2>
            <p className="module-card__desc">
              {mod.data.goal ?? mod.data.purpose}
            </p>
            <div className="module-card__meta">
              {mod.data.duration && <span>⏱ {mod.data.duration}</span>}
              {mod.data.level_after_completion && (
                <span>📊 {mod.data.level_after_completion}</span>
              )}
              {mod.isExam && <span>📝 {mod.data.mcq?.length ?? 0} أسئلة</span>}
              {mod.type === 'projects-workshop' && (
                <span>🛠 {mod.data.projects.length} مشاريع</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
