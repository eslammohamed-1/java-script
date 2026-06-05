export default function LearningPath({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <section className="learning-path">
      <h2 className="learning-path__title">خريطة المسار التعليمي</h2>
      <div className="learning-path__steps">
        {steps.map((step) => (
          <div key={step.num} className="learning-path__step">
            <div className="learning-path__num">{step.num}</div>
            <div>
              <strong>{step.title}</strong>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
