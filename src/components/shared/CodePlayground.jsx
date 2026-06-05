import { useMemo } from 'react';
import { buildSrcDoc } from '../../utils/buildSrcDoc';

export default function CodePlayground({ html, css, javascript, title = 'معاينة حية' }) {
  const srcDoc = useMemo(
    () => buildSrcDoc({ html, css, javascript }),
    [html, css, javascript]
  );

  if (!html && !javascript) return null;

  return (
    <div className="playground">
      <div className="playground__header">
        <span className="playground__title">{title}</span>
        <span className="playground__hint">جرّب التفاعل داخل الإطار</span>
      </div>
      <iframe
        className="playground__frame"
        title={title}
        srcDoc={srcDoc}
        sandbox="allow-scripts"
      />
    </div>
  );
}
