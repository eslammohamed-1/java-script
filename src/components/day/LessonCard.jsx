import ProjectLab from '../shared/ProjectLab';
import SeniorHints from '../shared/SeniorHints';

export default function LessonCard({ lesson, index, lessonId }) {
  const example = lesson.example;
  const labCode = example
    ? {
        html: example.html ?? '',
        css: example.css ?? '',
        javascript: example.javascript ?? '',
      }
    : null;

  return (
    <div className="card">
      <h3 className="card__title">
        {index + 1}. {lesson.name}
      </h3>
      <p>{lesson.explanation}</p>

      {lesson.methods?.length > 0 && (
        <table className="methods-table">
          <thead>
            <tr>
              <th>الطريقة</th>
              <th>الاستخدام</th>
            </tr>
          </thead>
          <tbody>
            {lesson.methods.map((m, i) => (
              <tr key={i}>
                <td>
                  <code>{m.method}</code>
                </td>
                <td>{m.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {lesson.common_events?.length > 0 && (
        <div className="chips">
          {lesson.common_events.map((ev) => (
            <span key={ev} className="chip">
              {ev}
            </span>
          ))}
        </div>
      )}

      {labCode && (
        <ProjectLab
          variant="lesson"
          storageKey={`${lessonId}-lesson-${index}`}
          starter={labCode}
          solution={labCode}
          title="جرب بنفسك"
        />
      )}

      <SeniorHints hints={lesson.senior_hints} />
    </div>
  );
}
