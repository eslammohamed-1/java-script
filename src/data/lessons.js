import { normalizeCourse } from '../utils/normalizeCourse';
import { normalizeWorkshop } from '../utils/normalizeWorkshop';
import { getJsFundamentalsQuestions } from './jsFundamentalsQuestions';

const lessonConfigs = import.meta.glob('../../lessons/*/lesson.json', {
  eager: true,
  import: 'default',
});

const lessonFiles = import.meta.glob('../../lessons/*/*.json', {
  eager: true,
  import: 'default',
});

function normalizeModuleData(type, raw) {
  if (type === 'projects-workshop') return normalizeWorkshop(raw);
  return normalizeCourse(raw);
}

function withQuestionBank(lessonId, mod, data) {
  if (lessonId !== 'js-fundamentals') return data;

  const questions = getJsFundamentalsQuestions(mod.source);
  if (!questions) return data;

  return {
    ...data,
    mcq: questions.mcq,
    complete_code_tests: questions.complete_code_tests,
  };
}

function buildLesson(config) {
  const folderPath = `../../lessons/${config.id}`;

  const modules = config.modules.map((mod) => {
    const filePath = `${folderPath}/${mod.source}`;
    const raw = lessonFiles[filePath];

    if (!raw) {
      console.warn(`Missing module file: ${filePath}`);
      return null;
    }

    const data = withQuestionBank(config.id, mod, normalizeModuleData(mod.type, raw));

    return {
      id: mod.id,
      type: mod.type,
      label: mod.label,
      isExam: mod.isExam ?? false,
      data,
    };
  }).filter(Boolean);

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    badge: config.badge,
    level: config.level,
    estimatedDuration: config.estimatedDuration,
    learningPath: config.learningPath ?? [],
    modules,
    moduleCount: modules.length,
  };
}

export const lessons = Object.values(lessonConfigs)
  .map(buildLesson)
  .sort((a, b) => a.id.localeCompare(b.id));

export function getLesson(lessonId) {
  return lessons.find((l) => l.id === lessonId) ?? null;
}

export function getModule(lessonId, moduleId) {
  const lesson = getLesson(lessonId);
  if (!lesson) return null;
  const mod = lesson.modules.find((m) => m.id === moduleId);
  if (!mod) return null;
  return { lesson, module: mod };
}

export function progressKey(lessonId, moduleId) {
  return `${lessonId}/${moduleId}`;
}
