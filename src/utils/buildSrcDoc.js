export function buildSrcDoc({ html = '', css = '', javascript = '' }) {
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
    cursor: pointer;
  }
  input, textarea {
    background: #1f2a3d;
    border: 1px solid #2a3548;
    color: #eef2f7;
    padding: 6px 10px;
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
  document.body.innerHTML += '<pre style="color:#f87171">' + err.message + '</pre>';
}
</script>
</body>
</html>`;
}
