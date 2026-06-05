export default function AnnotationPanel({ annotation, summary, mistakes }) {
  if (!annotation && !summary) {
    return (
      <div className="annotation-panel">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          اضغط على رقم سطر أو عنوان block لعرض الشرح
        </p>
      </div>
    );
  }

  if (summary) {
    return (
      <div className="annotation-panel">
        <div className="annotation-panel__title">ملخص</div>
        <p className="annotation-panel__explanation">{summary}</p>
        {mistakes?.length > 0 && (
          <div className="annotation-panel__mistakes">
            <strong style={{ color: 'var(--error)', fontSize: '0.9rem' }}>
              أخطاء شائعة:
            </strong>
            <ul>
              {mistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="annotation-panel">
      <div className="annotation-panel__title">{annotation.title}</div>
      <p className="annotation-panel__explanation">{annotation.explanation}</p>
      {annotation.seniorNote && (
        <div className="annotation-panel__senior senior-hints__card">
          <h4 className="senior-hints__card-title">ملاحظة احترافية</h4>
          <p className="senior-hints__card-text">{annotation.seniorNote}</p>
        </div>
      )}
    </div>
  );
}
