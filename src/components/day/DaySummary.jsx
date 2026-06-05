import LessonContent from '../shared/LessonContent';

export default function DaySummary({ summary, goal }) {
  if (!summary?.length) return null;

  return (
    <section className="section">
      <h2 className="section__title">ملخص اليوم</h2>
      <p className="section__lead">
        جدول شامل بكل ما ستتعلمه اليوم — مع شرح تفصيلي لكل موضوع قبل ما تبدأ
        الدروس والتدريبات.
      </p>

      {goal && (
        <div className="card summary-intro">
          <strong>هدف اليوم:</strong> {goal}
        </div>
      )}

      <div className="summary-table-wrap">
        <table className="summary-table">
          <thead>
            <tr>
              <th className="summary-table__num">#</th>
              <th className="summary-table__topic">الموضوع</th>
              <th>ماذا ستتعلم</th>
              <th>الشرح التفصيلي</th>
              <th>الأدوات الأساسية</th>
              <th>تطبيق عملي</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, i) => (
              <tr key={i}>
                <td className="summary-table__num">{i + 1}</td>
                <td className="summary-table__topic">
                  <strong>{row.topic}</strong>
                </td>
                <td>
                  {row.objectives?.length > 0 && (
                    <ul className="summary-table__list">
                      {row.objectives.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="summary-table__details">
                  {row.details ? <LessonContent text={row.details} /> : null}
                </td>
                <td>
                  {row.key_tools?.length > 0 && (
                    <div className="chips">
                      {row.key_tools.map((tool, j) => (
                        <span key={j} className="chip chip--skill">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="summary-table__practice">{row.practice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
