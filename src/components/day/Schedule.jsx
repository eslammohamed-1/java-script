export default function Schedule({ schedule }) {
  return (
    <section className="section">
      <h2 className="section__title">جدول اليوم</h2>
      <div className="card">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>الوقت</th>
              <th>الموضوع</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, i) => (
              <tr key={i}>
                <td className="time-col">{item.time}</td>
                <td>{item.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
