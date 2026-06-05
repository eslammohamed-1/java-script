import SeniorHints from '../shared/SeniorHints';

export default function GlobalSeniorHints({ hints }) {
  return (
    <section className="section">
      <h2 className="section__title">تلميحات عامة</h2>
      <SeniorHints hints={hints} title="مبادئ احترافية قبل ما تبدأ المشاريع" />
    </section>
  );
}
