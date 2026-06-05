import { useEffect, useState, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import Overview from './day/Overview';
import DaySummary from './day/DaySummary';
import Schedule from './day/Schedule';
import Lessons from './day/Lessons';
import MCQQuiz from './day/MCQQuiz';
import CodeWritingTests from './day/CodeWritingTests';
import FillInBlankTests from './day/FillInBlankTests';
import Projects from './day/Projects';
import FinalHomework from './day/FinalHomework';
import ExamResult from './day/ExamResult';
import WorkshopOverview from './workshop/WorkshopOverview';
import GlobalSeniorHints from './workshop/GlobalSeniorHints';
import PracticePlan from './workshop/PracticePlan';
import SuccessMetrics from './workshop/SuccessMetrics';
import ProjectWorkshop from './workshop/ProjectWorkshop';
import NotesPanel from './shared/NotesPanel';
import ThemeToggle from './ThemeToggle';
import { getDaySections, WORKSHOP_SECTIONS } from '../data/courses';
import { progressKey } from '../data/lessons';
import {
  loadProgress,
  markVisited,
  markCompleted,
  calcDayProgress,
  calcWorkshopProgress,
} from '../utils/progress';
import { awardXP } from '../utils/gamification';

export default function Layout({ lesson, module, onBack, onBackToLessons, onShowToast }) {
  const { data } = module;
  const isWorkshop = data.type === 'projects-workshop';
  const storageKey = progressKey(lesson.id, module.id);

  const sections = isWorkshop
    ? WORKSHOP_SECTIONS
    : getDaySections(data, module.isExam);

  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeProject, setActiveProject] = useState(
    isWorkshop ? data.projects[0]?.id : null
  );
  const [progress, setProgress] = useState(() => loadProgress(storageKey));
  const [showNotes, setShowNotes] = useState(false);

  const percent = isWorkshop
    ? calcWorkshopProgress(data, progress)
    : calcDayProgress(data, progress);

  const refreshProgress = useCallback(() => {
    setProgress(loadProgress(storageKey));
  }, [storageKey]);

  useEffect(() => {
    const updated = markVisited(storageKey, activeSection);
    const result = awardXP('visitSection');
    if (result.newBadges?.length > 0 && onShowToast) {
      onShowToast(result.newBadges[0]);
    }
    if (isWorkshop && activeSection === 'projects' && activeProject) {
      markVisited(storageKey, `project-${activeProject}`);
      awardXP('visitProject');
      setProgress(loadProgress(storageKey));
    } else {
      setProgress(updated);
    }
  }, [activeSection, activeProject, storageKey, isWorkshop]);

  function handleCorrect(itemId) {
    markCompleted(storageKey, itemId);
    const result = awardXP('correctAnswer');
    if (result.newBadges?.length > 0 && onShowToast) {
      onShowToast(result.newBadges[0]);
    }
    refreshProgress();
  }

  function handleAnnotate() {
    markCompleted(storageKey, `annotate-${activeProject}`);
    refreshProgress();
  }

  function handleChecklistDone() {
    markCompleted(storageKey, `checklist-${activeProject}`);
    refreshProgress();
  }

  function renderContent() {
    if (isWorkshop) {
      switch (activeSection) {
        case 'overview':
          return <WorkshopOverview module={data} />;
        case 'hints':
          return <GlobalSeniorHints hints={data.global_senior_hints} />;
        case 'plan':
          return <PracticePlan plan={data.final_practice_plan} />;
        case 'projects': {
          const project = data.projects.find((p) => p.id === activeProject);
          return (
            <>
              <div className="project-tabs">
                {data.projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`project-tab ${activeProject === p.id ? 'project-tab--active' : ''}`}
                    onClick={() => setActiveProject(p.id)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              {project && (
                <ProjectWorkshop
                  project={project}
                  lessonId={lesson.id}
                  onAnnotate={handleAnnotate}
                  onChecklistDone={handleChecklistDone}
                />
              )}
            </>
          );
        }
        case 'success':
          return <SuccessMetrics metrics={data.how_to_measure_success} />;
        default:
          return null;
      }
    }

    switch (activeSection) {
      case 'overview':
        return <Overview module={data} />;
      case 'summary':
        return (
          <DaySummary summary={data.learning_summary} goal={data.goal} />
        );
      case 'schedule':
        return <Schedule schedule={data.schedule} />;
      case 'lessons':
        return <Lessons lessons={data.lessons} lessonId={lesson.id} />;
      case 'mcq':
        return <MCQQuiz mcq={data.mcq} onCorrect={handleCorrect} />;
      case 'code-writing':
        return (
          <CodeWritingTests
            tests={data.code_writing_tests}
            lessonId={lesson.id}
          />
        );
      case 'fill-blank':
        return (
          <FillInBlankTests
            tests={data.complete_code_tests}
            onCorrect={handleCorrect}
          />
        );
      case 'projects':
        return <Projects projects={data.projects} lessonId={lesson.id} />;
      case 'homework':
        return <FinalHomework items={data.final_homework} />;
      case 'exam-result':
        return <ExamResult module={data} progress={progress} onShowToast={onShowToast} />;
      default:
        return null;
    }
  }

  const notesSectionKey = `${lesson.id}/${module.id}/${activeSection}`;

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">JS</div>
          <span className="app-header__breadcrumb">
            {lesson.title} / {data.title}
          </span>
        </div>
        <ProgressBar percent={percent} />
        <div className="app-header__actions">
          <button
            type="button"
            className={`app-header__notes-btn ${showNotes ? 'app-header__notes-btn--active' : ''}`}
            onClick={() => setShowNotes(!showNotes)}
            title="ملاحظاتي"
          >
            📝
          </button>
          <ThemeToggle />
          <button type="button" className="app-header__back" onClick={onBack}>
            ← الأقسام
          </button>
          <button
            type="button"
            className="app-header__back app-header__back--muted"
            onClick={onBackToLessons}
          >
            كل الدروس
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar__title">الأقسام</div>
          <ul className="sidebar__nav">
            {sections.map((section) => {
              const isDone = progress.visited.includes(section.id);
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    className={`sidebar__link ${activeSection === section.id ? 'sidebar__link--active' : ''} ${isDone ? 'sidebar__link--done' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="main-content">
          <div className="main-content__body animate-fade-in" key={activeSection}>
            {renderContent()}
          </div>
          {showNotes && (
            <div className="main-content__notes animate-slide-up">
              <NotesPanel sectionKey={notesSectionKey} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
