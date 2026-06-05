export default function WorkshopOverview({ module }) {
  return (
    <section className="section">
      <h2 className="section__title">نظرة عامة</h2>
      <div className="meta-grid">
        <div className="meta-item">
          <div className="meta-item__label">المستوى بعد الإكمال</div>
          <div className="meta-item__value">{module.level_after_completion}</div>
        </div>
        <div className="meta-item">
          <div className="meta-item__label">عدد المشاريع</div>
          <div className="meta-item__value">{module.projects.length}</div>
        </div>
      </div>
      <div className="card">
        <p>{module.purpose}</p>
      </div>
    </section>
  );
}
