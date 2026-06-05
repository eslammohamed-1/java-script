export const DAY_SECTIONS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'schedule', label: 'الجدول' },
  { id: 'lessons', label: 'الدروس' },
  { id: 'mcq', label: 'اختبار MCQ' },
  { id: 'code-writing', label: 'كتابة الكود' },
  { id: 'fill-blank', label: 'أكمل الفراغ' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'homework', label: 'الواجب النهائي', conditional: true },
  { id: 'exam-result', label: 'النتيجة', conditional: true, examOnly: true },
];

export const WORKSHOP_SECTIONS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'hints', label: 'تلميحات عامة' },
  { id: 'plan', label: 'خطة التطبيق' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'success', label: 'قياس النجاح' },
];

export function getDaySections(data, isExam = false) {
  const has = {
    overview: true,
    schedule: data.schedule?.length > 0,
    lessons: data.lessons?.length > 0,
    mcq: data.mcq?.length > 0,
    'code-writing': data.code_writing_tests?.length > 0,
    'fill-blank': data.complete_code_tests?.length > 0,
    projects: data.projects?.length > 0,
    homework: data.final_homework?.length > 0,
    'exam-result': isExam,
  };

  return DAY_SECTIONS.filter((s) => has[s.id]);
}
