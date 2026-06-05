import { useState } from 'react';
import ProjectLab from '../shared/ProjectLab';

function CodeTask({ task, html, solution, index, lessonId }) {
  const [showSolution, setShowSolution] = useState(false);

  const starter = { html, css: '', javascript: '' };
  const fullSolution = { html, css: '', javascript: solution };

  return (
    <div className="card code-task">
      <h3 className="card__title">
        {index + 1}. {task}
      </h3>

      <ProjectLab
        key={showSolution ? `solution-${index}` : `practice-${index}`}
        variant="lesson"
        storageKey={`${lessonId}-codewrite-${index}`}
        starter={showSolution ? fullSolution : starter}
        solution={fullSolution}
        title="اكتب الحل وجربه"
      />

      {!showSolution ? (
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setShowSolution(true)}
          style={{ marginTop: '0.75rem' }}
        >
          إظهار الحل في المحرر
        </button>
      ) : (
        <p className="mcq-feedback mcq-feedback--correct" style={{ marginTop: '0.75rem' }}>
          الحل ظاهر في تبويب JavaScript — اضغط تشغيل للتجربة
        </p>
      )}
    </div>
  );
}

export default function CodeWritingTests({ tests, lessonId }) {
  return (
    <section className="section">
      <h2 className="section__title">كتابة الكود</h2>
      <p className="section__subtitle">
        اكتب JavaScript في المحرر وجرب الحل مباشرة قبل إظهار الإجابة
      </p>
      {tests.map((test, i) => (
        <CodeTask key={i} index={i} lessonId={lessonId} {...test} />
      ))}
    </section>
  );
}
