import { useEffect, useMemo, useState } from 'react';
import ProjectLab from '../shared/ProjectLab';

const BOX_LABELS = {
  info: 'معلومة',
  tip: 'نصيحة',
  warning: 'تحذير',
  error: 'خطأ شائع',
  step: 'خطوة',
  code: 'كود',
};

function formatCell(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    if (value.text != null) return String(value.text);
    if (value.question != null && value.answer != null) {
      return `${value.question} — ${value.answer}`;
    }
    return Object.values(value)
      .filter((v) => typeof v === 'string' || typeof v === 'number')
      .join(' — ');
  }
  return String(value);
}

function isQuestionAnswerItem(item) {
  return item && typeof item === 'object' && item.question != null && item.answer != null;
}

function QaListItem({ item }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <li className="lesson-qa-item">
      <strong className="lesson-qa-item__question">{item.question}</strong>
      <button
        type="button"
        className="lesson-qa-item__toggle"
        onClick={() => setShowAnswer((prev) => !prev)}
        aria-expanded={showAnswer}
      >
        {showAnswer ? 'إخفاء الإجابة' : 'إظهار الإجابة'}
      </button>
      {showAnswer && (
        <p className="lesson-qa-item__answer">{item.answer}</p>
      )}
    </li>
  );
}

function ListItem({ item }) {
  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
    return <li>{String(item)}</li>;
  }

  if (isQuestionAnswerItem(item)) {
    return <QaListItem item={item} />;
  }

  if (item && typeof item === 'object' && item.text != null) {
    return <li>{String(item.text)}</li>;
  }

  return <li>{formatCell(item)}</li>;
}

function RichTable({ rows }) {
  if (!rows?.length) return null;
  const [header, ...body] = rows;

  return (
    <div className="lesson-table-wrap">
      <table className="lesson-table">
        {header && (
          <thead>
            <tr>
              {header.map((cell, i) => (
                <th key={i}>{formatCell(cell)}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{formatCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function shouldShowInteractiveLab(block) {
  const isJs = /javascript/i.test(block.language ?? '');
  const trimmed = (block.code ?? '').trim();
  if (!isJs) return false;
  if (!trimmed) return false;

  const codeLines = trimmed
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//'));

  if (codeLines.length > 1) return true;
  if (/console\.(log|warn|error|info|table|dir|group)/.test(trimmed)) return true;
  if (/\b(for|while|if|else|switch|function|return|=>)\b/.test(trimmed)) return true;

  // Single-line declarations stay preview-only
  if (/^(let|const|var)\s+\w+(\s*=\s*[^;]+)?;?\s*$/.test(trimmed)) return false;

  return false;
}

function BlockRenderer({ block, lessonId, blockPath }) {
  if (!block) return null;

  switch (block.type) {
    case 'text':
      return <p className="lesson-content__p">{block.text}</p>;

    case 'ordered_list':
      return (
        <ol className="lesson-content__list lesson-content__list--ordered">
          {block.items?.map((item, i) => (
            <ListItem key={i} item={item} />
          ))}
        </ol>
      );

    case 'unordered_list':
      return (
        <ul className="lesson-content__list">
          {block.items?.map((item, i) => (
            <ListItem key={i} item={item} />
          ))}
        </ul>
      );

    case 'code': {
      const code = block.code ?? '';
      const showLab = shouldShowInteractiveLab(block);
      const labCode = {
        html: "<div id='app'></div>",
        css: 'body { font-family: sans-serif; }',
        javascript: code,
      };

      return (
        <div className={`improved-code-block ${showLab ? '' : 'improved-code-block--preview-only'}`}>
          <pre className="lesson-code-preview">
            <code>{code}</code>
          </pre>
          {showLab && (
            <ProjectLab
              variant="lesson"
              storageKey={`${lessonId}-improved-${blockPath}`}
              starter={labCode}
              solution={labCode}
              title="جرب بنفسك"
            />
          )}
        </div>
      );
    }

    case 'output':
      return (
        <div className="lesson-output">
          <div className="lesson-output__label">الناتج</div>
          <pre>{block.text}</pre>
        </div>
      );

    case 'table':
      return <RichTable rows={block.rows} />;

    case 'box':
      return (
        <div className={`lesson-box lesson-box--${block.style ?? 'info'}`}>
          <div className="lesson-box__label">
            {BOX_LABELS[block.style] ?? block.style}
          </div>
          <div className="lesson-box__body">
            {block.blocks?.map((child, i) => (
              <BlockRenderer
                key={i}
                block={child}
                lessonId={lessonId}
                blockPath={`${blockPath}-${i}`}
              />
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

function AccordionPanel({ section, index, isOpen, onToggle, lessonId }) {
  const title = section.title?.trim() || `قسم ${index + 1}`;
  const panelId = `improved-section-${index}`;

  return (
    <article className={`improved-accordion ${isOpen ? 'improved-accordion--open' : ''}`}>
      <button
        type="button"
        className="improved-accordion__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="improved-accordion__title">{title}</span>
        <span className="improved-accordion__icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div
          id={panelId}
          className={`improved-accordion__panel improved-section improved-section--level-${section.level ?? 1}`}
        >
          {section.blocks?.map((block, i) => (
            <BlockRenderer
              key={i}
              block={block}
              lessonId={lessonId}
              blockPath={`${index}-${i}`}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default function ImprovedCourseContent({ module, lessonId }) {
  const sections = useMemo(
    () =>
      (module.sections ?? []).filter(
        (section) => section.title?.trim() || section.blocks?.length > 0
      ),
    [module.sections]
  );

  const [openIds, setOpenIds] = useState(() => new Set(sections.length ? [0] : []));

  useEffect(() => {
    setOpenIds(new Set(sections.length ? [0] : []));
  }, [lessonId, sections]);

  const toggleSection = (index) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const interactiveCount = useMemo(() => {
    let count = 0;
    const walk = (blocks) => {
      for (const block of blocks ?? []) {
        if (block.type === 'code' && shouldShowInteractiveLab(block)) count += 1;
        if (block.type === 'box') walk(block.blocks);
      }
    };
    for (const section of sections) walk(section.blocks);
    return count;
  }, [sections]);

  return (
    <section className="section improved-course">
      <h2 className="section__title">المحتوى</h2>
      <p className="section__subtitle">
        {sections.length} قسم — افتح كل قسم بالترتيب
        {interactiveCount > 0 && ` · ${interactiveCount} مثال تفاعلي`}
      </p>
      <div className="improved-course__body improved-course__accordion">
        {sections.map((section, i) => (
          <AccordionPanel
            key={i}
            section={section}
            index={i}
            isOpen={openIds.has(i)}
            onToggle={() => toggleSection(i)}
            lessonId={lessonId}
          />
        ))}
      </div>
    </section>
  );
}
