const PREFIX = 'course-progress-';

export function loadProgress(moduleId) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${moduleId}`);
    return raw ? JSON.parse(raw) : { visited: [], completed: [] };
  } catch {
    return { visited: [], completed: [] };
  }
}

export function saveProgress(moduleId, progress) {
  localStorage.setItem(`${PREFIX}${moduleId}`, JSON.stringify(progress));
}

export function markVisited(moduleId, sectionId) {
  const progress = loadProgress(moduleId);
  if (!progress.visited.includes(sectionId)) {
    progress.visited = [...progress.visited, sectionId];
    saveProgress(moduleId, progress);
  }
  return progress;
}

export function markCompleted(moduleId, itemId) {
  const progress = loadProgress(moduleId);
  if (!progress.completed.includes(itemId)) {
    progress.completed = [...progress.completed, itemId];
    saveProgress(moduleId, progress);
  }
  return progress;
}

export function calcDayProgress(module, progress) {
  const isExam =
    !module.lessons?.length &&
    !module.schedule?.length &&
    module.mcq?.length > 0;

  if (isExam) {
    const total =
      (module.mcq?.length ?? 0) + (module.complete_code_tests?.length ?? 0);
    const done = progress.completed.length;
    return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  }

  const sections = [
    'overview',
    'schedule',
    'lessons',
    'mcq',
    'code-writing',
    'fill-blank',
    'projects',
  ];
  if (module.final_homework?.length) sections.push('homework');

  const totalItems =
    sections.length +
    (module.mcq?.length ?? 0) +
    (module.complete_code_tests?.length ?? 0);

  let done = progress.visited.filter((v) => sections.includes(v)).length;
  done += progress.completed.length;

  return totalItems > 0 ? Math.min(100, Math.round((done / totalItems) * 100)) : 0;
}

export function calcWorkshopProgress(module, progress) {
  const sections = ['overview', 'hints', 'plan', 'success'];
  const projectIds = module.projects?.map((p) => `project-${p.id}`) ?? [];
  const total =
    sections.length +
    projectIds.length * 2 +
    (module.projects?.length ?? 0);

  let done = progress.visited.filter((v) =>
    [...sections, ...projectIds].includes(v)
  ).length;
  done += progress.completed.length;

  return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
}
