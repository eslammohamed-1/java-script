import { useMemo } from 'react';

function buildSrcDoc({ html = '', css = '', javascript = '' }) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    padding: 16px;
    margin: 0;
    background: #151d2e;
    color: #eef2f7;
  }
  button, input, select, textarea, h1, h2, h3, h4, p, li, span, label, div {
    color: #eef2f7;
  }
  button {
    background: #1f2a3d;
    border: 1px solid #2a3548;
    color: #eef2f7;
    padding: 6px 12px;
    border-radius: 6px;
  }
  ${css}
</style>
</head>
<body>
${html}
<script>
try {
  ${javascript}
} catch (err) {
  document.body.innerHTML += '<pre style="color:red">' + err.message + '</pre>';
}
</script>
</body>
</html>`;
}

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
