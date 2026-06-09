function isImprovedFormat(data) {
  return Boolean(data.sections && data.metadata);
}

function normalizeImprovedCourse(data) {
  const title = data.metadata?.title ?? '';
  const contentSections =
    data.sections?.filter((s) => s.title || s.blocks?.length) ?? [];

  return {
    type: 'improved-course',
    title,
    goal: title,
    duration: '—',
    metadata: data.metadata ?? {},
    titlePage: data.titlePage ?? [],
    sections: data.sections ?? [],
    schedule: [],
    learning_summary: [],
    lessons: contentSections,
    mcq: [],
    code_writing_tests: [],
    complete_code_tests: [],
    projects: [],
    final_homework: [],
  };
}

export function normalizeCourse(data) {
  if (isImprovedFormat(data)) {
    return normalizeImprovedCourse(data);
  }

  return {
    type: 'day-course',
    title: data.title,
    goal: data.goal,
    duration: data.duration,
    schedule: data.schedule ?? [],
    learning_summary: data.learning_summary ?? [],
    lessons: data.lessons ?? [],
    mcq: data.mcq ?? [],
    code_writing_tests: data.code_writing_tests ?? [],
    complete_code_tests: data.complete_code_tests ?? [],
    projects: data.projects ?? (data.project ? [data.project] : []),
    final_homework: data.final_homework ?? [],
  };
}
