import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.join(__dirname, '../lessons/js-fundamentals');

const END_TAGS =
  'infobox|tipbox|warningbox|errorbox|comparebox|codebox|stepbox|flowbox|verbatim|itemize|enumerate|center|tabular|longtable|mdframed';

function closeUnclosedBraces(text) {
  let s = text;
  const commands = ['en', 'code', 'textbf', 'textenglish', 'textit'];
  for (const cmd of commands) {
    const re = new RegExp(`\\\\${cmd}\\{([^}\\n]+)(?!})`, 'g');
    s = s.replace(re, `\\${cmd}{$1}`);
  }
  return s;
}

function fixPartialEndTags(text) {
  const tags = END_TAGS.split('|');
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      const broken = trimmed.match(/^\\?end\{([a-zA-Z]+)/i);
      if (broken && tags.includes(broken[1].toLowerCase())) {
        return `\\end{${broken[1].toLowerCase()}}`;
      }
      const full = trimmed.match(/^\\end\{([a-zA-Z]+)[`}\s]*$/);
      if (full && tags.includes(full[1].toLowerCase())) {
        return `\\end{${full[1].toLowerCase()}}`;
      }
      return line;
    })
    .join('\n');
}

function repairCorruptedMarkup(text) {
  return text
    .replace(/\\end\{([a-z]+)\}end\{([a-z]+)\}/gi, '\\end{$1}\n\\end{$2}')
    .replace(/\\end\{errorbox\}([a-z]+)/gi, '\\en{$1}')
    .replace(/\\end\{codebox\}([A-Za-z]+)/g, '\\en{$1}')
    .replace(/\\en\{\}([A-Za-z][A-Za-z0-9\s]*)/g, '\\en{$1}')
    .replace(/\\code\{\}([A-Za-z][A-Za-z0-9\s]*)/g, '\\code{$1}')
    .replace(/\\end\{itemize\}end\{stepbox\}/g, '')
    .replace(/([^\\])end\{(tipbox|codebox|infobox|warningbox|errorbox)\}/gi, '$1\\end{$2}')
    .replace(/\\textenglish\{\}--\s*([^}\n]+)\}/g, '\\textenglish{-- $1}')
    .replace(/\\textenglish\{\}--\}/g, '\\textenglish{--}')
    .replace(/\\textenglish\{\}--/g, '\\textenglish{--')
    .replace(/\\textbf\{\}([^}\n:]+)/g, '\\textbf{$1}')
    .replace(/\\code\{\}\+\+/g, '\\code{++}')
    .replace(/\\code\{\}\+/g, '\\code{+}')
    .replace(/\\code\{\}\\\{\s*\\/g, '\\code{\\{')
    .replace(/\\en\{Operator Precedenc\}e\}/g, '\\en{Operator Precedence}')
    .replace(/\\code\{\}(\d+)/g, '`$1`')
    .replace(/\\code\{\}\[\]/g, '`[]`')
    .replace(/\\textenglish\{\}-/g, '\\textenglish{--')
    .replace(
      /أوبريتور باقي القسمة هو `\\\s*\n/g,
      'أوبريتور باقي القسمة هو `%` '
    )
    .replace(/\\textenglish\{--\}/g, '\\textenglish{--}');
}

function stripLatexNoise(text) {
  let s = text;

  s = s.replace(/\\end\{document\}/g, '');
  s = s.replace(/\\begin\{center\}/g, '');
  s = s.replace(/\\end\{center\}/g, '');
  s = s.replace(/\\end\{mdframed\}/g, '');
  s = s.replace(/\\end\{mdframed/g, '');
  s = s.replace(/\\end\{verbatim\}/g, '');
  s = s.replace(/\\end\{verbatim/g, '');

  s = s.replace(/\{\\Large\\bfseries[^}]*\}/g, '');
  s = s.replace(/\{\\large[^}]*\}/g, '');

  s = s.replace(
    /\[معلومة\]\s*\n\s*\n\s*خلاصة الدرس:/g,
    '[معلومة]\nخلاصة الدرس:'
  );

  return s;
}

function fixBrokenHints(text) {
  return text
    .replace(
      /تلميح: استخدم `\\\s*\n\\end\{codebox[`}\s]*/g,
      'تلميح: استخدم `%` (باقي القسمة) لمعرفة لو الرقم زوجي.'
    )
    .replace(
      /تلميح: استخدم `\\\r?\n\\end\{codebox[`}\s]*/g,
      'تلميح: استخدم `%` (باقي القسمة) لمعرفة لو الرقم زوجي.'
    );
}

function fixHeadings(text) {
  return text.replace(/^(### [^\n]*`[^`\n]+)\n/gm, (line) => {
    const trimmed = line.trimEnd();
    if (trimmed.endsWith('`')) return line;
    return `${trimmed}\`\n`;
  });
}

function fixLessonText(text) {
  if (!text || typeof text !== 'string') return text;

  let s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  s = stripLatexNoise(s);
  s = repairCorruptedMarkup(s);
  s = fixBrokenHints(s);
  s = closeUnclosedBraces(s);
  s = fixPartialEndTags(s);
  s = repairCorruptedMarkup(s);
  s = fixHeadings(s);
  s = s.replace(/\n{3,}/g, '\n\n').trim();

  return s;
}

function walkAndFix(obj) {
  if (typeof obj === 'string') return fixLessonText(obj);
  if (Array.isArray(obj)) return obj.map(walkAndFix);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = walkAndFix(v);
    }
    return out;
  }
  return obj;
}

const files = fs
  .readdirSync(lessonsDir)
  .filter((f) => f.startsWith('day-') && f.endsWith('.json'));

let updated = 0;
for (const file of files) {
  const filePath = path.join(lessonsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const fixed = walkAndFix(data);
  const out = JSON.stringify(fixed, null, 2) + '\n';
  if (out !== raw.replace(/\r\n/g, '\n') && out !== raw) {
    fs.writeFileSync(filePath, out);
    updated++;
    console.log('Fixed', file);
  } else {
    console.log('OK', file);
  }
}

console.log(`Done. Updated ${updated} files.`);
