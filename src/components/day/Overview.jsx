export default function Overview({ module }) {
  return (
    <section className="section">
      <h2 className="section__title">نظرة عامة</h2>
      <div className="meta-grid">
        <div className="meta-item">
          <div className="meta-item__label">الهدف</div>
          <div className="meta-item__value">{module.goal}</div>
        </div>
        <div className="meta-item">
          <div className="meta-item__label">المدة</div>
          <div className="meta-item__value">{module.duration}</div>
        </div>
        <div className="meta-item">
          <div className="meta-item__label">عدد الدروس</div>
          <div className="meta-item__value">{module.lessons.length}</div>
        </div>
      </div>
      <div className="card">
        <p>{module.goal}</p>
      </div>
    </section>
  );
}
