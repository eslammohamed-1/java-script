const STEPS = [
  { num: 1, title: 'اليوم الأول', desc: 'DOM — اختيار العناصر، تعديل المحتوى، classList' },
  { num: 2, title: 'اليوم الثاني', desc: 'Events — addEventListener، forms، delegation' },
  { num: 3, title: 'الاختبار النهائي', desc: 'مراجعة شاملة قبل الورشة' },
  { num: 4, title: 'ورشة المشاريع', desc: 'Guess My Number، Modal، Pig Game' },
];

export default function LearningPath() {
  return (
    <section className="learning-path">
      <h2 className="learning-path__title">خريطة المسار التعليمي</h2>
      <div className="learning-path__steps">
        {STEPS.map((step, i) => (
          <div key={step.num} className="learning-path__step">
            <div className="learning-path__num">{step.num}</div>
            <div>
              <strong>{step.title}</strong>
              <p>{step.desc}</p>
            </div>
            {i < STEPS.length - 1 && (
              <span className="learning-path__arrow">←</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
