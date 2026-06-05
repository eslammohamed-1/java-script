import { useState } from 'react';

export default function ShareExport({ html, css, javascript, onClose }) {
  const [copied, setCopied] = useState(null);

  function buildFullHtml() {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مشروعي</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${javascript}
  </script>
</body>
</html>`;
  }

  function handleDownload() {
    const content = buildFullHtml();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleCopySnippet() {
    const snippet = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${javascript}`;
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied('snippet');
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function handleCopyLink() {
    try {
      const encoded = btoa(JSON.stringify({ html, css, javascript }));
      const link = `${window.location.origin}${window.location.pathname}#code=${encoded}`;
      navigator.clipboard.writeText(link).then(() => {
        setCopied('link');
        setTimeout(() => setCopied(null), 2000);
      });
    } catch {
      // Encoding may fail for very large projects
      setCopied(null);
    }
  }

  return (
    <div className="share-modal__overlay" onClick={onClose}>
      <div className="share-modal__content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="share-modal__close" onClick={onClose}>
          ✕
        </button>
        <h2 className="share-modal__title">مشاركة وتصدير المشروع</h2>

        <button type="button" className="share-modal__option" onClick={handleDownload}>
          <span className="share-modal__option-icon">📥</span>
          <div>
            <strong className="share-modal__option-title">تحميل كملف HTML</strong>
            <p className="share-modal__option-desc">
              تنزيل المشروع كملف HTML مستقل يعمل بدون إنترنت
            </p>
          </div>
        </button>

        <button type="button" className="share-modal__option" onClick={handleCopySnippet}>
          <span className="share-modal__option-icon">
            {copied === 'snippet' ? '✅' : '📋'}
          </span>
          <div>
            <strong className="share-modal__option-title">نسخ الكود</strong>
            <p className="share-modal__option-desc">
              {copied === 'snippet' ? 'تم النسخ!' : 'نسخ كود HTML و CSS و JavaScript معاً'}
            </p>
          </div>
        </button>

        <button type="button" className="share-modal__option" onClick={handleCopyLink}>
          <span className="share-modal__option-icon">
            {copied === 'link' ? '✅' : '🔗'}
          </span>
          <div>
            <strong className="share-modal__option-title">نسخ رابط المشاركة</strong>
            <p className="share-modal__option-desc">
              {copied === 'link' ? 'تم النسخ!' : 'إنشاء رابط يحتوي على الكود لمشاركته مع الآخرين'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
