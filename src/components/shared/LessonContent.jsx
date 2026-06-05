import {
  parseLessonMarkup,
  parseInlineTokens,
  parseLessonTitle,
} from '../../utils/parseLessonMarkup';

function InlineText({ text }) {
  const tokens = parseInlineTokens(text);
  if (!tokens.length) return null;

  return (
    <>
      {tokens.map((token, i) => {
        switch (token.type) {
          case 'code':
            return (
              <code key={i} className="lesson-inline-code">
                {token.value}
              </code>
            );
          case 'strong':
            return <strong key={i}>{token.value}</strong>;
          case 'en':
            return (
              <span key={i} className="lesson-inline-en" dir="ltr">
                {token.value}
              </span>
            );
          default:
            return <span key={i}>{token.value}</span>;
        }
      })}
    </>
  );
}

function RichParagraph({ content }) {
  return (
    <p className="lesson-content__p">
      <InlineText text={content} />
    </p>
  );
}

function RichList({ items }) {
  return (
    <ul className="lesson-content__list">
      {items.map((item, i) => (
        <li key={i}>
          <InlineText text={item} />
        </li>
      ))}
    </ul>
  );
}

function RichTable({ header, rows }) {
  const bodyRows = rows ?? [];
  const headRow = header ?? (bodyRows.length > 1 ? bodyRows[0] : null);
  const dataRows = header ? bodyRows : bodyRows.length > 1 ? bodyRows.slice(1) : bodyRows;

  return (
    <div className="lesson-table-wrap">
      <table className="lesson-table">
        {headRow && (
          <thead>
            <tr>
              {headRow.map((cell, i) => (
                <th key={i}>
                  <InlineText text={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {dataRows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BOX_LABELS = {
  info: 'معلومة',
  tip: 'نصيحة',
  warning: 'تحذير',
  error: 'خطأ شائع',
  compare: 'مقارنة',
  code: 'كود',
  step: 'خطوة',
};

function RichBox({ variant, content }) {
  const innerBlocks = parseLessonMarkup(content);

  return (
    <div className={`lesson-box lesson-box--${variant}`}>
      <div className="lesson-box__label">{BOX_LABELS[variant] ?? variant}</div>
      <div className="lesson-box__body">
        {innerBlocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h4 className="lesson-content__heading">
          <InlineText text={block.content} />
        </h4>
      );
    case 'paragraph':
      return <RichParagraph content={block.content} />;
    case 'list':
      return <RichList items={block.items} />;
    case 'table':
      return <RichTable header={block.header} rows={block.rows} />;
    case 'box':
      return <RichBox variant={block.variant} content={block.content} />;
    default:
      return null;
  }
}

export default function LessonContent({ text, className = '' }) {
  if (!text?.trim()) return null;

  const blocks = parseLessonMarkup(text);

  return (
    <div className={`lesson-content ${className}`.trim()}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

export { parseLessonTitle };
