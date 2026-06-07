export default function Overview({ module }) {
  const isImproved = module.type === 'improved-course';
  const improvements = module.metadata?.scientificReview?.mainImprovements ?? [];
  const sectionCount = module.sections?.length ?? module.lessons?.length ?? 0;

  return (
    <section className="section">
      <h2 className="section__title">نظرة عامة</h2>
      <div className="meta-grid">
        <div className="meta-item">
          <div className="meta-item__label">الهدف</div>
          <div className="meta-item__value">{module.goal || module.title}</div>
        </div>
        {!isImproved && (
          <div className="meta-item">
            <div className="meta-item__label">المدة</div>
            <div className="meta-item__value">{module.duration}</div>
          </div>
        )}
        <div className="meta-item">
          <div className="meta-item__label">{isImproved ? 'عدد الأقسام' : 'عدد الدروس'}</div>
          <div className="meta-item__value">{sectionCount}</div>
        </div>
        {isImproved && module.metadata?.version && (
          <div className="meta-item">
            <div className="meta-item__label">الإصدار</div>
            <div className="meta-item__value">{module.metadata.version}</div>
          </div>
        )}
      </div>
      <div className="card">
        <p>{module.goal || module.title}</p>
      </div>
      {isImproved && improvements.length > 0 && (
        <div className="card">
          <h3 className="card__title">التحسينات العلمية</h3>
          <ul className="lesson-content__list">
            {improvements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {isImproved && module.titlePage?.length > 0 && (
        <div className="card">
          <h3 className="card__title">عن الدرس</h3>
          {module.titlePage.map((line, i) => (
            <p key={i} className="lesson-content__p">{line}</p>
          ))}
        </div>
      )}
    </section>
  );
}
