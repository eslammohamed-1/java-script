import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { findAnnotation, getAnnotatedLines } from '../../utils/findAnnotation';
import AnnotationPanel from './AnnotationPanel';

const LANG_MAP = {
  html: 'html',
  javascript: 'javascript',
  css: 'css',
};

export default function AnnotatedCodeBlock({ block, onAnnotate }) {
  const [activeLine, setActiveLine] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const lines = block.code.split('\n');
  const annotatedLines = getAnnotatedLines(block.annotations);
  const annotation =
    activeLine != null
      ? findAnnotation(block.annotations, activeLine)
      : null;

  function handleLineClick(lineNum) {
    setShowSummary(false);
    setActiveLine(lineNum);
    onAnnotate?.();
  }

  function handleHeaderClick() {
    setActiveLine(null);
    setShowSummary(true);
    onAnnotate?.();
  }

  return (
    <div className="annotated-block">
      <div className="annotated-block__header" onClick={handleHeaderClick}>
        <span className="annotated-block__title">{block.title}</span>
        <span className="annotated-block__lang">{block.language}</span>
      </div>

      <div className="annotated-code">
        <div className="annotated-code__lines">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            let cls = 'annotated-code__line-num';
            if (activeLine === lineNum) cls += ' annotated-code__line-num--active';
            if (annotatedLines.has(lineNum))
              cls += ' annotated-code__line-num--annotated';

            return (
              <span
                key={lineNum}
                className={cls}
                onClick={() => handleLineClick(lineNum)}
              >
                {lineNum}
              </span>
            );
          })}
        </div>
        <div className="annotated-code__content">
          <SyntaxHighlighter
            language={LANG_MAP[block.language] ?? 'javascript'}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1rem', background: '#0d1117' }}
          >
            {block.code}
          </SyntaxHighlighter>
        </div>
      </div>

      <AnnotationPanel
        annotation={showSummary ? null : annotation}
        summary={showSummary ? block.summary : null}
        mistakes={showSummary ? block.commonMistakes : null}
      />
    </div>
  );
}
