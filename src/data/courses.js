import day1 from '../../jsons/day-1-dom-basics.json';
import day2 from '../../jsons/day-2-events.json';
import workshop from '../../jsons/jonas-style-dom-events-projects-interactive.json';
import { normalizeCourse } from '../utils/normalizeCourse';
import { normalizeWorkshop } from '../utils/normalizeWorkshop';

export const modules = [
  {
    id: 'day-1',
    type: 'day-course',
    label: 'اليوم الأول',
    data: normalizeCourse(day1),
  },
  {
    id: 'day-2',
    type: 'day-course',
    label: 'اليوم الثاني',
    data: normalizeCourse(day2),
  },
  {
    id: 'workshop',
    type: 'projects-workshop',
    label: 'ورشة المشاريع',
    data: normalizeWorkshop(workshop),
  },
];

export const DAY_SECTIONS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'schedule', label: 'الجدول' },
  { id: 'lessons', label: 'الدروس' },
  { id: 'mcq', label: 'اختبار MCQ' },
  { id: 'code-writing', label: 'كتابة الكود' },
  { id: 'fill-blank', label: 'أكمل الفراغ' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'homework', label: 'الواجب النهائي', conditional: true },
];

export const WORKSHOP_SECTIONS = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'hints', label: 'تلميحات عامة' },
  { id: 'plan', label: 'خطة التطبيق' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'success', label: 'قياس النجاح' },
];
