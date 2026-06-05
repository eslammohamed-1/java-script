import { useMemo } from 'react';

function buildSrcDoc({ html = '', css = '', javascript = '' }) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; padding: 16px; margin: 0; }
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
