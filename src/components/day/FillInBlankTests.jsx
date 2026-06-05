import { useState } from 'react';

function FillItem({ question, answer, index, onCorrect }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const isCorrect = value.trim().toLowerCase() === answer.toLowerCase();

  function handleCheck() {
    setChecked(true);
    if (isCorrect) onCorrect(`fill-${index}`);
  }

  const displayQuestion = question.replace(/_{2,}/g, '______');

  return (
    <div className="card fill-item">
      <p className="fill-item__code">{displayQuestion}</p>
      <input
        type="text"
        className="fill-item__input"
        placeholder="اكتب الإجابة..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={checked && isCorrect}
      />
      {(!checked || !isCorrect) && (
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleCheck}
          disabled={!value.trim()}
          style={{ marginTop: '0.75rem' }}
        >
          تحقق
        </button>
      )}
      {checked && (
        <div
          className={`mcq-feedback ${isCorrect ? 'mcq-feedback--correct' : 'mcq-feedback--wrong'}`}
          style={{ marginTop: '0.75rem' }}
        >
          {isCorrect
            ? '✓ صحيح!'
            : `✗ خطأ. الإجابة الصحيحة: ${answer}`}
        </div>
      )}
    </div>
  );
}

export default function FillInBlankTests({ tests, onCorrect }) {
  return (
    <section className="section">
      <h2 className="section__title">أكمل الفراغ</h2>
      <p className="section__subtitle">{tests.length} أسئلة</p>
      {tests.map((test, i) => (
        <FillItem
          key={i}
          index={i}
          question={test.question}
          answer={test.answer}
          onCorrect={onCorrect}
        />
      ))}
    </section>
  );
}
