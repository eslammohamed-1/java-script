const fs = require('fs');
const path = require('path');

const texBaseDir = '/Users/user/downloads/the-complete-javascript-course';
const jsonBaseDir = '/Users/user/Documents/java-script/lessons/js-fundamentals';

const jsonFiles = [
  { tex: '33. Activating Strict Mode/Strict Mode.tex', json: 'day-7-strict-mode.json' },
  { tex: '47. Iteration_ The for Loop/teration_ The for Loop.tex', json: 'day-17-for-loop.json' }
];

function cleanLatex(text) {
  let cleaned = text;
  cleaned = cleaned.replace(/%.*$/gm, '');
  cleaned = cleaned.replace(/\\en\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\code\{([^}]+)\}/g, '`$1`');
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\begin\{itemize\}/g, '');
  cleaned = cleaned.replace(/\\end\{itemize\}/g, '');
  cleaned = cleaned.replace(/\\begin\{enumerate\}[^\]]*\]/g, '');
  cleaned = cleaned.replace(/\\begin\{enumerate\}/g, '');
  cleaned = cleaned.replace(/\\end\{enumerate\}/g, '');
  cleaned = cleaned.replace(/\\item/g, '•');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function parseTex(content) {
  const lines = content.split('\n');
  let currentSection = null;
  let textAccumulator = [];
  let inListing = false;
  let currentCode = [];
  let lessons = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('\\begin{lstlisting}')) {
      inListing = true;
      continue;
    }
    if (line.includes('\\end{lstlisting}')) {
      inListing = false;
      if (currentSection) {
        currentSection.example = {
          html: "<div id='app'></div>",
          css: "body { font-family: sans-serif; }",
          javascript: currentCode.join('\n').replace(/\(\*@.*?@\*\)/g, '')
        };
      }
      currentCode = [];
      continue;
    }

    if (inListing) {
      currentCode.push(line);
      continue;
    }

    const sectionMatch = line.match(/\\section\{([^}]+)\}/) || line.match(/\\section\*\{([^}]+)\}/);
    if (sectionMatch) {
      if (currentSection) {
        currentSection.explanation = cleanLatex(textAccumulator.join('\n'));
        if (currentSection.explanation || currentSection.example) {
          lessons.push(currentSection);
        }
      }
      currentSection = {
        name: cleanLatex(sectionMatch[1]),
        explanation: "",
        example: null
      };
      textAccumulator = [];
      continue;
    }

    const subMatch = line.match(/\\subsection\{([^}]+)\}/);
    if (subMatch) {
      textAccumulator.push('\n### ' + cleanLatex(subMatch[1]) + '\n');
      continue;
    }

    if (line.startsWith('\\') && !line.includes('\\item') && !line.includes('\\code') && !line.includes('\\en') && !line.includes('\\textbf')) {
       if (line.includes('\\begin{tipbox}')) textAccumulator.push('\n[نصيحة]');
       if (line.includes('\\begin{warningbox}')) textAccumulator.push('\n[تحذير]');
       if (line.includes('\\begin{infobox}')) textAccumulator.push('\n[معلومة]');
       continue; 
    }

    textAccumulator.push(line);
  }

  if (currentSection) {
    currentSection.explanation = cleanLatex(textAccumulator.join('\n'));
    if (currentSection.explanation || currentSection.example) {
      lessons.push(currentSection);
    }
  }

  return { lessons };
}

jsonFiles.forEach(file => {
  const texPath = path.join(texBaseDir, file.tex);
  const jsonPath = path.join(jsonBaseDir, file.json);
  
  if (!fs.existsSync(texPath) || !fs.existsSync(jsonPath)) {
    console.log("Missing", texPath, "or", jsonPath);
    return;
  }

  const texContent = fs.readFileSync(texPath, 'utf8');
  const parsed = parseTex(texContent);
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  const overview = parsed.lessons.length > 0 ? parsed.lessons.shift() : null;
  if (overview) {
     jsonContent.learning_summary = [{
       topic: overview.name,
       objectives: [],
       details: overview.explanation,
       key_tools: [],
       practice: ""
     }];
  }

  jsonContent.lessons = parsed.lessons;
  fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));
  console.log("Updated", file.json);
});
