export default function FinalHomework({ items }) {
  if (!items?.length) return null;

  return (
    <section className="section">
      <h2 className="section__title">الواجب النهائي</h2>
      <div className="card">
        <ol className="steps-list">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
