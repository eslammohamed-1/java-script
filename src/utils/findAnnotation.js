export function findAnnotation(annotations, lineNumber) {
  if (!annotations?.length) return null;
  return (
    annotations.find(
      (a) => lineNumber >= a.lineStart && lineNumber <= a.lineEnd
    ) ?? null
  );
}

export function getAnnotatedLines(annotations) {
  const lines = new Set();
  annotations?.forEach((a) => {
    for (let i = a.lineStart; i <= a.lineEnd; i++) {
      lines.add(i);
    }
  });
  return lines;
}
