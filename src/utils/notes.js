const NOTES_KEY = 'user-notes';

export function loadAllNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function loadNotes(sectionKey) {
  const all = loadAllNotes();
  return all[sectionKey] || [];
}

export function saveNote(sectionKey, note) {
  const all = loadAllNotes();
  if (!all[sectionKey]) all[sectionKey] = [];
  all[sectionKey].push({
    id: Date.now().toString(36),
    text: note,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  return all[sectionKey];
}

export function deleteNote(sectionKey, noteId) {
  const all = loadAllNotes();
  if (!all[sectionKey]) return [];
  all[sectionKey] = all[sectionKey].filter((n) => n.id !== noteId);
  if (all[sectionKey].length === 0) delete all[sectionKey];
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  return all[sectionKey] || [];
}

export function updateNote(sectionKey, noteId, newText) {
  const all = loadAllNotes();
  if (!all[sectionKey]) return [];
  all[sectionKey] = all[sectionKey].map((n) =>
    n.id === noteId ? { ...n, text: newText, updatedAt: new Date().toISOString() } : n
  );
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  return all[sectionKey];
}

export function countAllNotes() {
  const all = loadAllNotes();
  return Object.values(all).reduce((sum, arr) => sum + arr.length, 0);
}

export function exportNotesAsMarkdown() {
  const all = loadAllNotes();
  let md = '# ملاحظاتي — كورس JavaScript DOM & Events\n\n';
  md += `تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}\n\n---\n\n`;

  for (const [key, notes] of Object.entries(all)) {
    md += `## ${key}\n\n`;
    for (const note of notes) {
      const date = new Date(note.createdAt).toLocaleDateString('ar-EG');
      md += `- ${note.text} _(${date})_\n`;
    }
    md += '\n';
  }
  return md;
}
