import { useState } from 'react';
import { lessons, getLesson, getModule } from './data/lessons';
import LessonPicker from './components/LessonPicker';
import ModulePicker from './components/ModulePicker';
import Layout from './components/Layout';

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);

  const activeLesson = getLesson(activeLessonId);
  const activeEntry = getModule(activeLessonId, activeModuleId);

  const showAppHeader = !activeModuleId;

  return (
    <>
      {showAppHeader && (
        <header className="app-header">
          <div className="app-header__brand">
            <div className="app-header__logo">JS</div>
            <span>{activeLesson ? activeLesson.title : 'الكورس التعليمي'}</span>
          </div>
        </header>
      )}

      {!activeLesson ? (
        <LessonPicker
          lessons={lessons}
          onSelect={(id) => setActiveLessonId(id)}
        />
      ) : !activeModuleId ? (
        <ModulePicker
          lesson={activeLesson}
          onSelect={(id) => setActiveModuleId(id)}
          onBack={() => setActiveLessonId(null)}
        />
      ) : activeEntry ? (
        <Layout
          lesson={activeEntry.lesson}
          module={activeEntry.module}
          onBack={() => setActiveModuleId(null)}
          onBackToLessons={() => {
            setActiveModuleId(null);
            setActiveLessonId(null);
          }}
        />
      ) : null}
    </>
  );
}
