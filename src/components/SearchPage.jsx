import { useState, useEffect } from 'react';
import { lessons } from '../data/lessons';

export default function SearchPage({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ lessons: [], questions: [], projects: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ lessons: [], questions: [], projects: [] });
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const resLessons = [];
      const resQuestions = [];
      const resProjects = [];

      lessons.forEach(lesson => {
        if (lesson.title.toLowerCase().includes(q) || lesson.description.toLowerCase().includes(q)) {
          resLessons.push({ lessonId: lesson.id, title: lesson.title, context: lesson.description });
        }

        lesson.modules.forEach(mod => {
          if (mod.data.title && mod.data.title.toLowerCase().includes(q)) {
            resLessons.push({ lessonId: lesson.id, moduleId: mod.id, title: mod.data.title, context: `في درس: ${lesson.title}` });
          }

          if (mod.data.mcq) {
            mod.data.mcq.forEach(qItem => {
              if (qItem.question.toLowerCase().includes(q)) {
                resQuestions.push({ lessonId: lesson.id, moduleId: mod.id, title: qItem.question, context: `سؤال في: ${mod.data.title}` });
              }
            });
          }

          if (mod.data.projects) {
            mod.data.projects.forEach(p => {
              if (p.name.toLowerCase().includes(q)) {
                resProjects.push({ lessonId: lesson.id, moduleId: mod.id, title: p.name, context: `مشروع في: ${mod.data.title}` });
              }
            });
          }
        });
      });

      setResults({ lessons: resLessons, questions: resQuestions, projects: resProjects });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = results.lessons.length + results.questions.length + results.projects.length;

  return (
    <div className="search-page animate-fade-in">
      <h1 className="search-page__title">البحث في الكورس</h1>
      <div className="search-page__input-wrap">
        <input 
          type="text" 
          className="search-page__input" 
          placeholder="ابحث عن دروس، مشاريع، أسئلة..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="search-page__input-icon">🔍</span>
      </div>

      {query.trim() && (
        <div className="search-page__count">
          تم العثور على {totalResults} نتيجة
        </div>
      )}

      {!query.trim() && (
        <div className="search-page__empty">
          <div className="search-page__empty-icon">🔎</div>
          <p>اكتب أي كلمة للبحث في محتوى الكورس بالكامل.</p>
        </div>
      )}

      {query.trim() && totalResults === 0 && (
        <div className="search-page__empty">
          <div className="search-page__empty-icon">😢</div>
          <p>لم نجد أي نتائج مطابقة لبحثك.</p>
        </div>
      )}

      <div className="search-page__results">
        {results.lessons.length > 0 && (
          <div className="search-page__group">
            <h3 className="search-page__group-title">الدروس والأقسام ({results.lessons.length})</h3>
            {results.lessons.map((item, i) => (
              <div key={i} className="search-page__result" onClick={() => onNavigate(item.lessonId, item.moduleId)}>
                <div className="search-page__result-title">{item.title}</div>
                <div className="search-page__result-context">{item.context}</div>
              </div>
            ))}
          </div>
        )}

        {results.projects.length > 0 && (
          <div className="search-page__group">
            <h3 className="search-page__group-title">المشاريع ({results.projects.length})</h3>
            {results.projects.map((item, i) => (
              <div key={i} className="search-page__result" onClick={() => onNavigate(item.lessonId, item.moduleId)}>
                <div className="search-page__result-title">{item.title}</div>
                <div className="search-page__result-context">{item.context}</div>
              </div>
            ))}
          </div>
        )}

        {results.questions.length > 0 && (
          <div className="search-page__group">
            <h3 className="search-page__group-title">الأسئلة (MCQ) ({results.questions.length})</h3>
            {results.questions.map((item, i) => (
              <div key={i} className="search-page__result" onClick={() => onNavigate(item.lessonId, item.moduleId)}>
                <div className="search-page__result-title">{item.title}</div>
                <div className="search-page__result-context">{item.context}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
