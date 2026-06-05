export default function SuccessMetrics({ metrics }) {
  return (
    <section className="section">
      <h2 className="section__title">قياس النجاح</h2>
      <div className="card">
        <ul className="requirements-list">
          {metrics.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
