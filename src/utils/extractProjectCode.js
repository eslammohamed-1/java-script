function extractStyleFromHtml(code) {
  let html = code;
  let css = '';
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = styleRegex.exec(code)) !== null) {
    css += `${match[1].trim()}\n`;
    html = html.replace(match[0], '');
  }

  return { html: html.trim(), css: css.trim() };
}

export function extractProjectCode(codeBlocks = []) {
  let html = '';
  let css = '';
  let javascript = '';

  for (const block of codeBlocks) {
    if (block.language === 'html') {
      const { html: htmlPart, css: cssPart } = extractStyleFromHtml(block.code);
      html = html ? `${html}\n${htmlPart}` : htmlPart;
      css = css ? `${css}\n${cssPart}` : cssPart;
    } else if (block.language === 'javascript') {
      javascript = javascript
        ? `${javascript}\n\n${block.code}`
        : block.code;
    } else if (block.language === 'css') {
      css = css ? `${css}\n${block.code}` : block.code;
    }
  }

  return { html, css, javascript };
}

export function extractStarterCode(codeBlocks = []) {
  const htmlBlocks = codeBlocks.filter((b) => b.language === 'html');
  const { html, css } = extractProjectCode(htmlBlocks);
  return { html, css, javascript: '' };
}
