import { useState } from 'react';
import CodeTabs from '../shared/CodeTabs';

function CodeTask({ task, html, solution, index }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="card code-task">
      <h3 className="card__title">
        {index + 1}. {task}
      </h3>
      <div className="code-task__html">
        <CodeTabs example={{ html }} />
      </div>
      {!showSolution ? (
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setShowSolution(true)}
        >
          إظهار الحل
        </button>
      ) : (
        <div className="solution-reveal">
          <CodeTabs example={{ javascript: solution }} />
        </div>
      )}
    </div>
  );
}

export default function CodeWritingTests({ tests }) {
  return (
    <section className="section">
      <h2 className="section__title">كتابة الكود</h2>
      <p className="section__subtitle">
        اقرأ المهمة وحاول الحل قبل إظهار الإجابة
      </p>
      {tests.map((test, i) => (
        <CodeTask key={i} index={i} {...test} />
      ))}
    </section>
  );
}
