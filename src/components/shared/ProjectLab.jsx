import { useEffect, useMemo, useState, useRef } from 'react';
import { buildSrcDoc } from '../../utils/buildSrcDoc';
import { useApp } from '../../context/AppContext';
import ConsolePanel from './ConsolePanel';
import ShareExport from '../ShareExport';

// CodeMirror imports
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { html as langHtml } from '@codemirror/lang-html';
import { css as langCss } from '@codemirror/lang-css';
import { javascript as langJs } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup } from 'codemirror';

const EDITOR_TABS = [
  { id: 'html', label: 'HTML', lang: langHtml() },
  { id: 'css', label: 'CSS', lang: langCss() },
  { id: 'javascript', label: 'JavaScript', lang: langJs() },
];

const LIVE_DELAY_MS = 350;

export default function ProjectLab({
  storageKey,
  starter,
  solution,
  title = 'طبّق المشروع هنا',
  variant = 'project',
}) {
  const isLesson = variant === 'lesson';
  const { theme } = useApp();

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(`project-lab-${storageKey}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [activeTab, setActiveTab] = useState('html');
  const [code, setCode] = useState(() => {
    const saved = loadSaved();
    return {
      html: saved?.html ?? starter.html ?? '',
      css: saved?.css ?? starter.css ?? '',
      javascript: saved?.javascript ?? starter.javascript ?? '',
    };
  });
  const [liveCode, setLiveCode] = useState(code);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState([]);
  const [consoleVisible, setConsoleVisible] = useState(true);
  const [showShare, setShowShare] = useState(false);

  const editorRef = useRef(null);
  const viewRef = useRef(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`project-lab-${storageKey}`, JSON.stringify(code));
  }, [storageKey, code]);

  // Debounce live preview
  useEffect(() => {
    const timer = setTimeout(() => {
      setLiveCode(code);
      setPreviewKey((k) => k + 1);
    }, LIVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [code]);

  // Handle messages from iframe (Console)
  useEffect(() => {
    function handleMessage(e) {
      if (e.data && e.data.type === 'console') {
        setLogs(prev => [...prev, {
          level: e.data.level,
          args: e.data.args,
          timestamp: Date.now()
        }]);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current) return;

    const onUpdate = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        setCode(prev => ({ ...prev, [activeTab]: newValue }));
      }
    });

    const activeLang = EDITOR_TABS.find(t => t.id === activeTab).lang;

    const state = EditorState.create({
      doc: code[activeTab],
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        activeLang,
        oneDark,
        EditorView.lineWrapping,
        onUpdate,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [activeTab]); // Re-create on tab switch to load correct language and content

  const srcDoc = useMemo(
    () => buildSrcDoc(liveCode, theme),
    [liveCode, previewKey, theme]
  );

  function handleReset(mode) {
    const source = mode === 'solution' ? solution : starter;
    const newCode = {
      html: source.html ?? '',
      css: source.css ?? '',
      javascript: source.javascript ?? '',
    };
    setCode(newCode);
    setLogs([]);
    
    // Update current editor view immediately
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {from: 0, to: viewRef.current.state.doc.length, insert: newCode[activeTab]}
      });
    }
  }

  function handleClear() {
    const newCode = { html: '', css: '', javascript: '' };
    setCode(newCode);
    setLogs([]);
    
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: {from: 0, to: viewRef.current.state.doc.length, insert: ''}
      });
    }
  }

  async function handleCopyAll() {
    const combined = `<!-- HTML -->\n${code.html}\n\n/* CSS */\n${code.css}\n\n// JavaScript\n${code.javascript}`;
    await navigator.clipboard.writeText(combined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`project-lab ${isLesson ? 'project-lab--lesson' : ''}`}>
      <div className="project-lab__header">
        <div>
          <h3 className="project-lab__title">{title}</h3>
          <p className="project-lab__desc">
            عدّل الكود في التبويبات — المعاينة والـ Terminal يتحدثان تلقائياً
          </p>
        </div>
        <div className="btn-group">
          {isLesson ? (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handleReset('starter')}
            >
              إعادة المثال
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handleReset('starter')}
            >
              HTML فقط
            </button>
          )}
          {solution && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => handleReset('solution')}
            >
              {isLesson ? 'تحميل الحل' : 'إظهار الحل'}
            </button>
          )}
          {!isLesson && (
            <button type="button" className="btn btn--ghost" onClick={handleClear}>
              مسح
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={() => setShowShare(true)}>
            مشاركة / تصدير
          </button>
        </div>
      </div>

      {showShare && (
        <ShareExport 
          html={code.html}
          css={code.css}
          javascript={code.javascript}
          onClose={() => setShowShare(false)}
        />
      )}

      <div className="project-lab__tabs">
        {EDITOR_TABS.map((tab) => (
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

      <div className="project-lab__editor-wrap" ref={editorRef} />

      <div className="project-lab__preview-section">
        <div className="project-lab__preview-header">
          <span className="project-lab__preview-title">معاينة حية</span>
          <span className="project-lab__preview-hint">تتحدث تلقائيًا مع التعديل</span>
        </div>
        <iframe
          key={previewKey}
          className="project-lab__preview"
          title="معاينة حية"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin"
        />
        <ConsolePanel 
          logs={logs} 
          onClear={() => setLogs([])} 
          isVisible={consoleVisible}
          onToggle={() => setConsoleVisible(!consoleVisible)}
        />
      </div>
    </div>
  );
}
