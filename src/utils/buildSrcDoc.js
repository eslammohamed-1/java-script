export function buildSrcDoc({ html = '', css = '', javascript = '' }, theme = 'dark') {
  const isLight = theme === 'light';
  
  const bg = isLight ? '#ffffff' : '#151d2e';
  const color = isLight ? '#1a202c' : '#eef2f7';
  const btnBg = isLight ? '#f0f2f5' : '#1f2a3d';
  const btnBorder = isLight ? '#e0e4ea' : '#2a3548';
  const inputBg = isLight ? '#ffffff' : '#1f2a3d';
  const errorColor = isLight ? '#dc2626' : '#f87171';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl" style="color-scheme: ${isLight ? 'light' : 'dark'};">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, sans-serif;
    padding: 16px;
    margin: 0;
    background: ${bg};
    color: ${color};
  }
  button, input, select, textarea, h1, h2, h3, h4, p, li, span, label, div {
    color: ${color};
  }
  button {
    background: ${btnBg};
    border: 1px solid ${btnBorder};
    color: ${color};
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
  }
  input, textarea {
    background: ${inputBg};
    border: 1px solid ${btnBorder};
    color: ${color};
    padding: 6px 10px;
    border-radius: 6px;
  }
  ${css}
</style>
<script>
  // Console Interceptor
  (function() {
    function serializeArg(arg) {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (arg instanceof Error) return arg.message;
      if (typeof arg === 'object') {
        try { return JSON.stringify(arg); } 
        catch (e) { return '[Object]'; }
      }
      return String(arg);
    }
    function overrideConsole(method) {
      const original = console[method];
      console[method] = function(...args) {
        const serialized = args.map(serializeArg).join(' ');
        window.parent.postMessage({ type: 'console', level: method, args: serialized }, '*');
        original.apply(console, args);
      };
    }
    ['log', 'warn', 'error', 'info'].forEach(overrideConsole);
    
    window.onerror = function(message, source, lineno, colno, error) {
      window.parent.postMessage({ type: 'console', level: 'error', args: message }, '*');
    };
  })();
</script>
</head>
<body>
${html}
<script>
try {
  ${javascript}
} catch (err) {
  document.body.innerHTML += '<pre style="color:${errorColor}">' + err.message + '</pre>';
  console.error(err);
}
</script>
</body>
</html>`;
}
