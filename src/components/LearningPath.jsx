function normalizeStep(step, index) {
  if (typeof step === 'string') {
    return {
      key: step,
      num: index + 1,
      title: step,
      desc: '',
    };
  }

  return {
    key: step.id ?? String(step.num ?? index),
    num: step.num ?? index + 1,
    title: step.title ?? '',
    desc: step.desc ?? '',
  };
}

export default function LearningPath({ steps = [] }) {
  if (!steps.length) return null;

  const normalized = steps.map(normalizeStep);

  return (
    <section className="learning-path">
      <h2 className="learning-path__title">خريطة المسار التعليمي</h2>
      <div className="learning-path__steps">
        {normalized.map((step) => (
          <div key={step.key} className="learning-path__step">
            <div className="learning-path__num">{step.num}</div>
            <div>
              <strong>{step.title}</strong>
              {step.desc && <p>{step.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
