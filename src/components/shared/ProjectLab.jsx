import { useEffect, useMemo, useState } from 'react';
import { buildSrcDoc } from '../../utils/buildSrcDoc';

const TABS = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'preview', label: 'معاينة' },
];

export default function ProjectLab({
  storageKey,
  starter,
  solution,
  title = 'طبّق المشروع هنا',
}) {
  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(`project-lab-${storageKey}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [activeTab, setActiveTab] = useState('html');
  const [html, setHtml] = useState(() => loadSaved()?.html ?? starter.html ?? '');
  const [css, setCss] = useState(() => loadSaved()?.css ?? starter.css ?? '');
  const [javascript, setJavascript] = useState(
    () => loadSaved()?.javascript ?? starter.javascript ?? ''
  );
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      `project-lab-${storageKey}`,
      JSON.stringify({ html, css, javascript })
    );
  }, [storageKey, html, css, javascript]);

  const srcDoc = useMemo(
    () => buildSrcDoc({ html, css, javascript }),
    [html, css, javascript, previewKey]
  );

  function handleRun() {
    setPreviewKey((k) => k + 1);
    setActiveTab('preview');
  }

  function handleReset(mode) {
    const source = mode === 'solution' ? solution : starter;
    setHtml(source.html ?? '');
    setCss(source.css ?? '');
    setJavascript(source.javascript ?? '');
    setPreviewKey((k) => k + 1);
  }

  function handleClear() {
    setHtml('');
    setCss('');
    setJavascript('');
    setPreviewKey((k) => k + 1);
  }

  async function handleCopyAll() {
    const combined = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JavaScript\n${javascript}`;
    await navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="project-lab">
      <div className="project-lab__header">
        <div>
          <h3 className="project-lab__title">{title}</h3>
          <p className="project-lab__desc">
            اكتب الكود بنفسك، اضغط تشغيل، وشوف النتيجة مباشرة — شغلك محفوظ تلقائيًا
          </p>
        </div>
        <div className="btn-group">
          <button type="button" className="btn btn--primary" onClick={handleRun}>
            ▶ تشغيل
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => handleReset('starter')}
          >
            HTML فقط
          </button>
          {solution && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => handleReset('solution')}
            >
              إظهار الحل
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={handleClear}>
            مسح
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleCopyAll}>
            {copied ? 'تم النسخ ✓' : 'نسخ الكل'}
          </button>
        </div>
      </div>

      <div className="project-lab__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`project-lab__tab ${activeTab === tab.id ? 'project-lab__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="project-lab__body">
        {activeTab === 'html' && (
          <textarea
            className="project-lab__editor"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="اكتب HTML هنا..."
            spellCheck={false}
          />
        )}
        {activeTab === 'css' && (
          <textarea
            className="project-lab__editor"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder="اكتب CSS هنا..."
            spellCheck={false}
          />
        )}
        {activeTab === 'javascript' && (
          <textarea
            className="project-lab__editor project-lab__editor--code"
            value={javascript}
            onChange={(e) => setJavascript(e.target.value)}
            placeholder="اكتب JavaScript هنا..."
            spellCheck={false}
            dir="ltr"
          />
        )}
        {activeTab === 'preview' && (
          <iframe
            key={previewKey}
            className="project-lab__preview"
            title="معاينة المشروع"
            srcDoc={srcDoc}
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
}
