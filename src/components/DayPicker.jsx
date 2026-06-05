export default function DayPicker({ modules, onSelect }) {
  return (
    <div className="day-picker">
      <div className="day-picker__hero">
        <h1>كورس JavaScript DOM & Events</h1>
        <p>
          منهج تفاعلي بالعربية يغطي أساسيات DOM والأحداث، ثم ورشة مشاريع
          عملية بأسلوب Jonas
        </p>
      </div>
      <div className="day-picker__grid">
        {modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            className="module-card"
            onClick={() => onSelect(mod.id)}
          >
            <span className="module-card__badge">
              {mod.type === 'day-course' ? 'يوم تعليمي' : 'ورشة مشاريع'}
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
