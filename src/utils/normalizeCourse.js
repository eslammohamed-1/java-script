export function normalizeCourse(data) {
  return {
    type: 'day-course',
    title: data.title,
    goal: data.goal,
    duration: data.duration,
    schedule: data.schedule ?? [],
    lessons: data.lessons ?? [],
    mcq: data.mcq ?? [],
    code_writing_tests: data.code_writing_tests ?? [],
    complete_code_tests: data.complete_code_tests ?? [],
    projects: data.projects ?? (data.project ? [data.project] : []),
    final_homework: data.final_homework ?? [],
  };
}
