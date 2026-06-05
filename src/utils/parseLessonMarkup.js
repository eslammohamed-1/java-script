const BOX_STARTS = {
  '[معلومة]': 'info',
  '[نصيحة]': 'tip',
  '[تحذير]': 'warning',
};

const BOX_TYPE_MAP = {
  infobox: 'info',
  tipbox: 'tip',
  warningbox: 'warning',
  errorbox: 'error',
  comparebox: 'compare',
  codebox: 'code',
  stepbox: 'step',
  flowbox: 'info',
  verbatim: 'code',
};

const NOISE_END_TAGS = new Set([
  'center',
  'document',
  'tabular',
  'longtable',
  'itemize',
  'enumerate',
  'mdframed',
]);

const NOISE_PATTERNS = [
  /^\\end\{center\}$/,
  /^\\begin\{center\}$/,
  /^\\end\{document\}$/,
  /^\\endhead$/,
  /^\\end\{tabular\}$/,
  /^\\end\{longtable\}$/,
  /^\\end\{itemize\}$/,
  /^\\end\{itemize$/,
  /^\\begin\{itemize\}$/,
  /^\\end\{mdframed\}$/,
  /^\\end\{mdframed$/,
  /^\\end\{verbatim\}$/,
  /^\\end\{verbatim$/,
];

function matchBoxEnd(trimmed) {
  const m = trimmed.match(/^\\end\{([a-zA-Z]+)(.*)$/);
  if (!m) return null;
  const tag = m[1];
  const rest = m[2];
  if (rest && !/^[`}\s]*$/.test(rest)) return null;
  if (NOISE_END_TAGS.has(tag)) return { kind: 'noise' };
  return { kind: 'box', variant: BOX_TYPE_MAP[tag] ?? 'info' };
}

function stripTrailingEndMarkers(text) {
  return text
    .split('\n')
    .filter((line) => !/^\\end\{[a-zA-Z]+[`}\s]*$/.test(line.trim()))
    .join('\n')
    .replace(/\n?\\end\{[a-zA-Z]+[`}\s]*$/g, '')
    .trim();
}

const MATH_REPLACEMENTS = [
  [/\\Rightarrow/g, '→'],
  [/\\rightarrow/g, '→'],
  [/\\times/g, '×'],
  [/\\leq/g, '≤'],
  [/\\geq/g, '≥'],
  [/\\neq/g, '≠'],
];

function isNoiseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return NOISE_PATTERNS.some((re) => re.test(trimmed));
}

function isTableRow(line) {
  const trimmed = line.trim();
  return trimmed.includes(' & ') && !trimmed.startsWith('[');
}

function isBulletLine(line) {
  return /^\s*•\s/.test(line);
}

function isHeadingLine(line) {
  return line.trim().startsWith('### ');
}

function cleanTableCell(cell) {
  return cell.replace(/\\\\\s*$/, '').trim();
}

function parseTableRows(lines) {
  return lines.map((line) =>
    line.split(' & ').map((cell) => cleanTableCell(cell))
  );
}

function extractBraceContent(text, command, startIndex) {
  const open = text.indexOf('{', startIndex);
  if (open === -1) return { content: '', end: startIndex + command.length };

  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}') {
      depth--;
      if (depth === 0) {
        return { content: text.slice(open + 1, i), end: i + 1 };
      }
    }
  }
  return { content: text.slice(open + 1), end: text.length };
}

function parseInlineTokens(text) {
  if (!text) return [];

  let normalized = text;
  for (const [re, replacement] of MATH_REPLACEMENTS) {
    normalized = normalized.replace(re, replacement);
  }
  normalized = normalized.replace(/\$([^$]+)\$/g, (_, inner) => {
    let v = inner;
    for (const [re, replacement] of MATH_REPLACEMENTS) {
      v = v.replace(re, replacement);
    }
    return v;
  });

  const tokens = [];
  let i = 0;

  while (i < normalized.length) {
    if (normalized[i] === '`') {
      const end = normalized.indexOf('`', i + 1);
      if (end !== -1) {
        tokens.push({ type: 'code', value: normalized.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    const commands = [
      { cmd: '\\textenglish', type: 'en' },
      { cmd: '\\en{', type: 'en', raw: '\\en' },
      { cmd: '\\textbf{', type: 'strong', raw: '\\textbf' },
      { cmd: '\\code{', type: 'code', raw: '\\code' },
      { cmd: '\\textit{', type: 'text', raw: '\\textit' },
    ];

    let matched = false;
    for (const { cmd, type, raw } of commands) {
      if (normalized.startsWith(cmd, i) || (raw && normalized.startsWith(raw, i))) {
        const base = raw ?? cmd;
        const { content, end } = extractBraceContent(normalized, base, i);
        tokens.push({ type, value: content });
        i = end;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const nextSpecial = normalized.slice(i).search(/[`\\]/);
    const end =
      nextSpecial === -1 ? normalized.length : i + nextSpecial;
    if (end > i) {
      const chunk = normalized.slice(i, end);
      if (chunk) tokens.push({ type: 'text', value: chunk });
    }
    i = end === i ? i + 1 : end;
  }

  return tokens.filter((t) => t.value !== '');
}

export function hasLessonMarkup(text) {
  if (!text) return false;
  return (
    /\[معلومة\]|\[نصيحة\]|\[تحذير\]|\\end\{|\\textenglish|\\en\{|\\textbf\{|\\code\{|### /.test(
      text
    ) || / & .*\\\\/.test(text)
  );
}

export function parseLessonTitle(text) {
  if (!text) return '';
  const tokens = parseInlineTokens(text);
  return tokens.map((t) => t.value).join('');
}

export function parseLessonMarkup(text) {
  if (!text?.trim()) return [];

  const lines = text.split('\n');
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let tableLines = [];
  let boxType = null;
  let boxLines = [];

  function flushParagraph() {
    const content = stripTrailingEndMarkers(paragraphLines.join('\n'));
    if (content) blocks.push({ type: 'paragraph', content });
    paragraphLines = [];
  }

  function flushList() {
    if (listItems.length) {
      blocks.push({ type: 'list', items: [...listItems] });
      listItems = [];
    }
  }

  function flushTable() {
    if (tableLines.length) {
      const rows = parseTableRows(tableLines);
      const hasEndhead = rows.some((r) =>
        r.some((c) => c.trim() === '\\endhead')
      );
      const cleanRows = rows
        .map((r) => r.filter((c) => c.trim() !== '\\endhead'))
        .filter((r) => r.some((c) => c.trim()));

      if (cleanRows.length) {
        blocks.push({
          type: 'table',
          header: hasEndhead ? cleanRows[0] : null,
          rows: hasEndhead ? cleanRows.slice(1) : cleanRows,
        });
      }
      tableLines = [];
    }
  }

  function flushBox() {
    if (boxType && boxLines.length) {
      const content = stripTrailingEndMarkers(boxLines.join('\n'));
      if (content) {
        blocks.push({ type: 'box', variant: boxType, content });
      }
    }
    boxType = null;
    boxLines = [];
  }

  function flushAll() {
    flushParagraph();
    flushList();
    flushTable();
    flushBox();
  }

  for (const rawLine of lines) {
    const line = rawLine;
    const trimmed = line.trim();

    if (isNoiseLine(trimmed)) continue;

    const subsection = trimmed.match(/^\\subsection\*\{(.+)\}$/);
    if (subsection) {
      flushAll();
      blocks.push({ type: 'heading', content: subsection[1] });
      continue;
    }

    const boxEnd = matchBoxEnd(trimmed);
    if (boxEnd) {
      if (boxEnd.kind === 'noise') continue;
      flushList();
      flushTable();
      if (boxType) {
        flushBox();
      } else {
        const orphan = stripTrailingEndMarkers(paragraphLines.join('\n'));
        paragraphLines = [];
        if (orphan) {
          blocks.push({ type: 'box', variant: boxEnd.variant, content: orphan });
        }
      }
      continue;
    }

    if (BOX_STARTS[trimmed]) {
      flushParagraph();
      flushList();
      flushTable();
      flushBox();
      boxType = BOX_STARTS[trimmed];
      continue;
    }

    if (boxType) {
      if (isHeadingLine(trimmed)) {
        flushBox();
        blocks.push({
          type: 'heading',
          content: trimmed.replace(/^###\s+/, ''),
        });
        continue;
      }
      boxLines.push(line);
      continue;
    }

    if (isHeadingLine(trimmed)) {
      flushParagraph();
      flushList();
      flushTable();
      blocks.push({
        type: 'heading',
        content: trimmed.replace(/^###\s+/, ''),
      });
      continue;
    }

    if (isTableRow(trimmed)) {
      flushParagraph();
      flushList();
      tableLines.push(trimmed);
      continue;
    }

    if (tableLines.length && !isTableRow(trimmed)) {
      flushTable();
    }

    if (isBulletLine(line)) {
      flushParagraph();
      listItems.push(line.replace(/^\s*•\s*/, '').trim());
      continue;
    }

    if (listItems.length && trimmed && !isBulletLine(line)) {
      flushList();
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    paragraphLines.push(line);
  }

  flushAll();
  return blocks;
}

export { parseInlineTokens };
