import { useRef, useEffect } from 'react';

export default function ConsolePanel({ logs, onClear, isVisible, onToggle }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current && isVisible) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs, isVisible]);

  if (!isVisible) {
    return (
      <div className="console-panel">
        <div className="console-panel__header" style={{cursor: 'pointer'}} onClick={onToggle}>
          <div className="console-panel__title">
            <span>Terminal</span>
            {logs.length > 0 && <span className="console-panel__count">{logs.length}</span>}
          </div>
          <button className="console-panel__toggle">فتح ⇡</button>
        </div>
      </div>
    );
  }

  return (
    <div className="console-panel">
      <div className="console-panel__header">
        <div className="console-panel__title">
          <span>Terminal</span>
          {logs.length > 0 && <span className="console-panel__count">{logs.length}</span>}
        </div>
        <div className="console-panel__actions">
          <button className="console-panel__clear" onClick={onClear}>مسح ⊘</button>
          <button className="console-panel__toggle" onClick={onToggle}>إغلاق ⇣</button>
        </div>
      </div>
      <div className="console-panel__body" ref={bodyRef}>
        {logs.length === 0 ? (
          <div className="console-panel__empty">لا يوجد مخرجات في الـ Console حتى الآن.</div>
        ) : (
          logs.map((log, i) => {
            let icon = '>';
            let cls = 'console-panel__entry';
            if (log.level === 'warn') { icon = '⚠'; cls += ' console-panel__entry--warn'; }
            else if (log.level === 'error') { icon = '✖'; cls += ' console-panel__entry--error'; }
            else if (log.level === 'info') { icon = 'ℹ'; cls += ' console-panel__entry--info'; }
            
            const timeStr = new Date(log.timestamp).toLocaleTimeString('ar-EG', {hour12: false});
            
            return (
              <div key={i} className={cls}>
                <span className="console-panel__entry-time">[{timeStr}]</span>
                <span className="console-panel__entry-icon">{icon}</span>
                <span className="console-panel__entry-content">{log.args}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
