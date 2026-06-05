export default function PracticePlan({ plan }) {
  return (
    <section className="section">
      <h2 className="section__title">خطة التطبيق</h2>
      <div className="practice-plan">
        {plan.map((item, i) => (
          <div key={i} className="practice-plan__item">
            <span className="practice-plan__day">{item.day}</span>
            <div>
              <strong>{item.project}</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {item.focus}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
