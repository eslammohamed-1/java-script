import LearningPath from './LearningPath';

function moduleBadge(mod) {
  if (mod.isExam) return 'اختبار نهائي';
  if (mod.type === 'projects-workshop') return 'ورشة مشاريع';
  return 'يوم تعليمي';
}

export default function DayPicker({ modules, onSelect }) {
  return (
    <div className="day-picker">
      <div className="day-picker__hero">
        <h1>كورس JavaScript DOM & Events</h1>
        <p>
          منهج تفاعلي بالعربية يغطي أساسيات DOM والأحداث، ثم اختبار شامل،
          ثم ورشة مشاريع عملية بأسلوب Jonas
        </p>
      </div>
      <LearningPath />
      <div className="day-picker__grid">
        {modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            className={`module-card ${mod.isExam ? 'module-card--exam' : ''}`}
            onClick={() => onSelect(mod.id)}
          >
            <span className="module-card__badge">
              {moduleBadge(mod)}
            </span>
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
