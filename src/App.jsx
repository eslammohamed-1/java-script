import { useState, useEffect, lazy, Suspense } from 'react';
import { lessons, getLesson, getModule } from './data/lessons';
import LessonPicker from './components/LessonPicker';
import ModulePicker from './components/ModulePicker';
import Layout from './components/Layout';
import ThemeToggle from './components/ThemeToggle';
import PomodoroTimer from './components/PomodoroTimer';
import AchievementToast from './components/AchievementToast';
import MobileNav from './components/MobileNav';
import { updateStreak } from './utils/gamification';

const Dashboard = lazy(() => import('./components/Dashboard'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const CheatSheet = lazy(() => import('./components/CheatSheet'));

const VIEWS = {
  DASHBOARD: 'dashboard',
  LESSONS: 'lessons',
  MODULES: 'modules',
  LAYOUT: 'layout',
  SEARCH: 'search',
  CHEATSHEET: 'cheatsheet',
};

function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner" />
      <p>جاري التحميل...</p>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [toast, setToast] = useState(null);

  const activeLesson = getLesson(activeLessonId);
  const activeEntry = getModule(activeLessonId, activeModuleId);

  // Update streak on app load
  useEffect(() => {
    updateStreak();
  }, []);

  function showToast(badge) {
    setToast(badge);
  }

  function goToDashboard() {
    setActiveModuleId(null);
    setActiveLessonId(null);
    setView(VIEWS.DASHBOARD);
  }

  function goToLessons() {
    setActiveModuleId(null);
    setActiveLessonId(null);
    setView(VIEWS.LESSONS);
  }

  function handleSelectLesson(id) {
    setActiveLessonId(id);
    setView(VIEWS.MODULES);
  }

  function handleSelectModule(id) {
    setActiveModuleId(id);
    setView(VIEWS.LAYOUT);
  }

  function handleSearchNavigate(lessonId, moduleId) {
    setActiveLessonId(lessonId);
    if (moduleId) {
      setActiveModuleId(moduleId);
      setView(VIEWS.LAYOUT);
    } else {
      setView(VIEWS.MODULES);
    }
  }

  function handleMobileNav(target) {
    if (target === VIEWS.DASHBOARD) goToDashboard();
    else if (target === VIEWS.LESSONS) goToLessons();
    else if (target === VIEWS.SEARCH) setView(VIEWS.SEARCH);
    else if (target === VIEWS.CHEATSHEET) setView(VIEWS.CHEATSHEET);
  }

  const showTopNav = view !== VIEWS.LAYOUT;

  return (
    <>
      {showTopNav && (
        <header className="app-header">
          <div className="app-header__brand">
            <div className="app-header__logo" onClick={goToDashboard} style={{ cursor: 'pointer' }}>JS</div>
            <span>
              {view === VIEWS.MODULES && activeLesson
                ? activeLesson.title
                : 'كورس JavaScript'}
            </span>
          </div>
          <nav className="app-header__nav">
            <button
              type="button"
              className={`app-header__nav-btn ${view === VIEWS.DASHBOARD ? 'app-header__nav-btn--active' : ''}`}
              onClick={goToDashboard}
            >
              📊 لوحتي
            </button>
            <button
              type="button"
              className={`app-header__nav-btn ${view === VIEWS.LESSONS ? 'app-header__nav-btn--active' : ''}`}
              onClick={goToLessons}
            >
              📚 الدروس
            </button>
            <button
              type="button"
              className={`app-header__nav-btn ${view === VIEWS.SEARCH ? 'app-header__nav-btn--active' : ''}`}
              onClick={() => setView(VIEWS.SEARCH)}
            >
              🔍 بحث
            </button>
            <button
              type="button"
              className={`app-header__nav-btn ${view === VIEWS.CHEATSHEET ? 'app-header__nav-btn--active' : ''}`}
              onClick={() => setView(VIEWS.CHEATSHEET)}
            >
              📖 مرجع سريع
            </button>
          </nav>
          <div className="app-header__actions">
            <ThemeToggle />
          </div>
        </header>
      )}

      <Suspense fallback={<LoadingFallback />}>
        {view === VIEWS.DASHBOARD && (
          <Dashboard
            onStartLesson={handleSelectLesson}
            onShowToast={showToast}
          />
        )}

        {view === VIEWS.LESSONS && (
          <LessonPicker
            lessons={lessons}
            onSelect={handleSelectLesson}
          />
        )}

        {view === VIEWS.MODULES && activeLesson && (
          <ModulePicker
            lesson={activeLesson}
            onSelect={handleSelectModule}
            onBack={goToLessons}
          />
        )}

        {view === VIEWS.LAYOUT && activeEntry && (
          <Layout
            lesson={activeEntry.lesson}
            module={activeEntry.module}
            onBack={() => {
              setActiveModuleId(null);
              setView(VIEWS.MODULES);
            }}
            onBackToLessons={goToLessons}
            onShowToast={showToast}
          />
        )}

        {view === VIEWS.SEARCH && (
          <SearchPage onNavigate={handleSearchNavigate} />
        )}

        {view === VIEWS.CHEATSHEET && <CheatSheet />}
      </Suspense>

      <PomodoroTimer />

      <MobileNav
        view={view === VIEWS.MODULES ? VIEWS.LESSONS : view}
        views={VIEWS}
        onNavigate={handleMobileNav}
      />

      {toast && (
        <AchievementToast
          badge={toast}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
