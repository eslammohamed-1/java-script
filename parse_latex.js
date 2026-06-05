const fs = require('fs');
const path = require('path');

const texBaseDir = '/Users/user/downloads/the-complete-javascript-course';
const jsonBaseDir = '/Users/user/Documents/java-script/lessons/js-fundamentals';

const jsonFiles = [
  { tex: '9. Values and Variables/Values and Variables.tex', json: 'day-1-values-variables.json' },
  { tex: '11. Data Types/Data Types.tex', json: 'day-2-data-types.json' },
  { tex: '13. Basic Operators/Basic Operators.tex', json: 'day-3-basic-operators.json' },
  { tex: '18. Taking Decisions - if else Statements/Taking Decisions - if else Statements.tex', json: 'day-4-if-else.json' },
  { tex: '20. Type Conversion and Coercion/Type Conversion and Coercion.tex', json: 'day-5-type-conversion.json' },
  { tex: '21. Truthy and Falsy Values/Truthy and Falsy Values.tex', json: 'day-6-truthy-falsy.json' },
  { tex: '33. Activating Strict Mode/Activating Strict Mode.tex', json: 'day-7-strict-mode.json' },
  { tex: '34. Functions/Functions.tex', json: 'day-8-functions.json' },
  { tex: '35. Function Declarations vs. Expressions/Function Declarations vs. Expressions.tex', json: 'day-9-function-declarations.json' },
  { tex: '36. Arrow Functions/Arrow Functions.tex', json: 'day-10-arrow-functions.json' },
  { tex: '37. Functions Calling Other Functions/Functions Calling Other Functions.tex', json: 'day-11-functions-calling-functions.json' },
  { tex: '40. Introduction to Arrays/Introduction to Arrays.tex', json: 'day-12-arrays.json' },
  { tex: '41. Basic Array Operations (Methods)/Basic Array Operations (Methods).tex', json: 'day-13-array-methods.json' },
  { tex: '43. Introduction to Objects/Introduction to Objects.tex', json: 'day-14-objects.json' },
  { tex: '44. Dot vs. Bracket Notation/Dot vs. Bracket Notation.tex', json: 'day-15-dot-bracket.json' },
  { tex: '45. Object Methods/Object Methods.tex', json: 'day-16-object-methods.json' },
  { tex: '47. Iteration_ The for Loop/Iteration_ The for Loop.tex', json: 'day-17-for-loop.json' }
];

function cleanLatex(text) {
  let cleaned = text;
  // Remove comments
  cleaned = cleaned.replace(/%.*$/gm, '');
  // Extract text from \en{...}, \code{...}, \textbf{...}
  cleaned = cleaned.replace(/\\en\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\code\{([^}]+)\}/g, '`$1`');
  cleaned = cleaned.replace(/\\textbf\{([^}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\textit\{([^}]+)\}/g, '$1');
  // Remove itemize/enumerate tags but keep items
  cleaned = cleaned.replace(/\\begin\{itemize\}/g, '');
  cleaned = cleaned.replace(/\\end\{itemize\}/g, '');
  cleaned = cleaned.replace(/\\begin\{enumerate\}[^\]]*\]/g, '');
  cleaned = cleaned.replace(/\\begin\{enumerate\}/g, '');
  cleaned = cleaned.replace(/\\end\{enumerate\}/g, '');
  cleaned = cleaned.replace(/\\item/g, '•');
  
  // Clean up excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function parseTex(content) {
  const lines = content.split('\n');
  let currentSection = null;
  let textAccumulator = [];
  let inListing = false;
  let currentCode = [];
  
  let learning_summary = [];
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
          javascript: currentCode.join('\n').replace(/\(\*@.*?@\*\)/g, '') // remove latex comments in code
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
      // Save previous section
      if (currentSection) {
        currentSection.explanation = cleanLatex(textAccumulator.join('\n'));
        if (currentSection.explanation || currentSection.example) {
          lessons.push(currentSection);
        }
      }
      currentSection = {
        name: sectionMatch[1],
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

    // Ignore preamble and document tags
    if (line.startsWith('\\') && !line.includes('\\item') && !line.includes('\\code') && !line.includes('\\en') && !line.includes('\\textbf')) {
       // but keep \begin{tipbox} etc as text markers
       if (line.includes('\\begin{tipbox}')) textAccumulator.push('\n[نصيحة]');
       if (line.includes('\\begin{warningbox}')) textAccumulator.push('\n[تحذير]');
       if (line.includes('\\begin{infobox}')) textAccumulator.push('\n[معلومة]');
       continue; 
    }

    textAccumulator.push(line);
  }

  // push last section
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
  
  // We keep mcq, code_writing_tests, complete_code_tests from the AI!
  // We just replace learning_summary and lessons with the verbatim parsing.
  
  // Move the first lesson from parsed.lessons to learning_summary to act as overview
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

  // The rest are lessons
  jsonContent.lessons = parsed.lessons;

  fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2));
  console.log("Updated", file.json);
});
