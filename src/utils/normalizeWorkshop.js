export function normalizeWorkshop(data) {
  return {
    type: 'projects-workshop',
    title: data.title,
    purpose: data.purpose,
    level_after_completion: data.level_after_completion,
    global_senior_hints: data.global_senior_hints ?? [],
    projects: data.projects ?? [],
    final_practice_plan: data.final_practice_plan ?? [],
    how_to_measure_success: data.how_to_measure_success ?? [],
  };
}
