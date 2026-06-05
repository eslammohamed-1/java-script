import CodeTabs from '../shared/CodeTabs';

export default function LessonCard({ lesson, index }) {
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

      {lesson.example && <CodeTabs example={lesson.example} />}

      {lesson.senior_hints?.length > 0 && (
        <div className="hint-box">
          <div className="hint-box__title">تلميحات للمتقدمين</div>
          <ul>
            {lesson.senior_hints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
