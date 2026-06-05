import { useState, useEffect } from 'react';
import { loadNotes, saveNote, deleteNote, updateNote, exportNotesAsMarkdown } from '../../utils/notes';
import { awardXP } from '../../utils/gamification';

export default function NotesPanel({ sectionKey }) {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setNotes(loadNotes(sectionKey));
  }, [sectionKey]);

  function handleAddNote() {
    if (!inputText.trim()) return;
    const newNotes = saveNote(sectionKey, inputText);
    setNotes(newNotes);
    setInputText('');
    awardXP('writeNote');
  }

  function handleDelete(id) {
    if (window.confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
      setNotes(deleteNote(sectionKey, id));
    }
  }

  function handleSaveEdit(id) {
    if (!editText.trim()) return;
    setNotes(updateNote(sectionKey, id, editText));
    setEditingId(null);
  }

  function handleExport() {
    const md = exportNotesAsMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'javascript-course-notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="notes-panel">
      <div className="notes-panel__header">
        <h3>ملاحظاتي على هذا القسم</h3>
        <button className="notes-panel__export-btn" onClick={handleExport}>
          تصدير الملاحظات ⬇
        </button>
      </div>

      <div className="notes-panel__input-wrap">
        <input 
          type="text" 
          className="notes-panel__input" 
          placeholder="اكتب ملاحظة مهمة..." 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddNote()}
        />
        <button className="notes-panel__add-btn" onClick={handleAddNote}>إضافة</button>
      </div>

      <div className="notes-panel__list">
        {notes.length === 0 ? (
          <div className="notes-panel__empty">لم تكتب أي ملاحظات في هذا القسم بعد.</div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="notes-panel__note">
              <div style={{flex: 1}}>
                {editingId === note.id ? (
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input 
                      autoFocus
                      type="text" 
                      className="notes-panel__input" 
                      value={editText} 
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveEdit(note.id)}
                      style={{padding: '0.3rem 0.5rem'}}
                    />
                    <button className="btn btn--primary" onClick={() => handleSaveEdit(note.id)}>حفظ</button>
                    <button className="btn btn--ghost" onClick={() => setEditingId(null)}>إلغاء</button>
                  </div>
                ) : (
                  <>
                    <div className="notes-panel__note-text">{note.text}</div>
                    <div className="notes-panel__note-date">
                      {new Date(note.createdAt).toLocaleDateString('ar-EG', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                    </div>
                  </>
                )}
              </div>
              {editingId !== note.id && (
                <div className="notes-panel__note-actions">
                  <button onClick={() => { setEditingId(note.id); setEditText(note.text); }} title="تعديل">✏️</button>
                  <button onClick={() => handleDelete(note.id)} title="حذف">🗑</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
