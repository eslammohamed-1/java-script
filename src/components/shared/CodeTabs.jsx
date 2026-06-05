import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LANG_MAP = {
  html: 'html',
  javascript: 'javascript',
  css: 'css',
};

export default function CodeTabs({ example, solution }) {
  const tabs = [];
  if (example?.html) tabs.push({ key: 'html', label: 'HTML', code: example.html });
  if (example?.javascript) tabs.push({ key: 'javascript', label: 'JavaScript', code: example.javascript });
  if (example?.css) tabs.push({ key: 'css', label: 'CSS', code: example.css });
  if (solution) tabs.push({ key: 'solution', label: 'الحل', code: solution });

  const [active, setActive] = useState(tabs[0]?.key ?? 'html');
  const [copied, setCopied] = useState(false);

  if (!tabs.length) return null;

  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  async function handleCopy() {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-tabs">
      <div className="code-tabs__header">
        <div className="code-tabs__buttons">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`code-tabs__btn ${active === tab.key ? 'code-tabs__btn--active' : ''}`}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button type="button" className="code-tabs__copy" onClick={handleCopy}>
          {copied ? 'تم النسخ ✓' : 'نسخ'}
        </button>
      </div>
      <div className="code-tabs__body">
        <SyntaxHighlighter
          language={LANG_MAP[current.key] ?? 'javascript'}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1rem', background: '#0d1117' }}
          showLineNumbers
        >
          {current.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
