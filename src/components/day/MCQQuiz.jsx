import { useState } from 'react';

function MCQItem({ question, choices, answer, explanation, index, onCorrect }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (selected === answer) {
      onCorrect(`mcq-${index}`);
    }
  }

  return (
    <div className="card mcq-item">
      <p className="mcq-item__question">
        {index + 1}. {question}
      </p>
      <ul className="mcq-choices">
        {choices.map((choice) => {
          let cls = 'mcq-choice';
          if (selected === choice) cls += ' mcq-choice--selected';
          if (checked && choice === answer) cls += ' mcq-choice--correct';
          if (checked && selected === choice && choice !== answer)
            cls += ' mcq-choice--wrong';

          return (
            <li key={choice}>
              <button
                type="button"
                className={cls}
                onClick={() => !checked && setSelected(choice)}
              >
                {choice}
              </button>
            </li>
          );
        })}
      </ul>
      {!checked && (
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleCheck}
          disabled={!selected}
          style={{ marginTop: '0.75rem' }}
        >
          تحقق
        </button>
      )}
      {checked && (
        <div
          className={`mcq-feedback ${selected === answer ? 'mcq-feedback--correct' : 'mcq-feedback--wrong'}`}
        >
          {selected === answer
            ? '✓ إجابة صحيحة!'
            : `✗ إجابة خاطئة. الإجابة الصحيحة: ${answer}`}
          {explanation && (
            <div className="quiz-explanation">{explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MCQQuiz({ mcq, onCorrect }) {
  return (
    <section className="section">
      <h2 className="section__title">اختبار MCQ</h2>
      <p className="section__subtitle">{mcq.length} أسئلة اختيار من متعدد</p>
      {mcq.map((item, i) => (
        <MCQItem
          key={i}
          index={i}
          question={item.question}
          choices={item.choices}
          answer={item.answer}
          explanation={item.explanation}
          onCorrect={onCorrect}
        />
      ))}
    </section>
  );
}
