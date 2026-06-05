export default function GlobalSeniorHints({ hints }) {
  return (
    <section className="section">
      <h2 className="section__title">تلميحات عامة</h2>
      <div className="hint-box">
        <ul>
          {hints.map((hint, i) => (
            <li key={i}>{hint}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
