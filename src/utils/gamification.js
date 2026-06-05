const GAMIFICATION_KEY = 'gamification-data';

const BADGE_DEFS = [
  { id: 'first-lesson', title: 'أول درس', desc: 'أكملت أول قسم في الكورس', icon: '🎯', condition: (d) => d.sectionsVisited >= 1 },
  { id: 'quiz-starter', title: 'بداية الكويز', desc: 'أجبت على أول سؤال صح', icon: '✅', condition: (d) => d.correctAnswers >= 1 },
  { id: 'quiz-master', title: 'ملك الكويزات', desc: 'أجبت على 10 أسئلة صح', icon: '🏆', condition: (d) => d.correctAnswers >= 10 },
  { id: 'quiz-legend', title: 'أسطورة الأسئلة', desc: 'أجبت على 25 سؤال صح', icon: '👑', condition: (d) => d.correctAnswers >= 25 },
  { id: 'first-project', title: 'أول مشروع', desc: 'فتحت أول مشروع تطبيقي', icon: '🛠', condition: (d) => d.projectsVisited >= 1 },
  { id: 'project-pro', title: 'مطور مشاريع', desc: 'زرت 3 مشاريع', icon: '💻', condition: (d) => d.projectsVisited >= 3 },
  { id: 'explorer', title: 'مستكشف', desc: 'زرت 10 أقسام مختلفة', icon: '🔍', condition: (d) => d.sectionsVisited >= 10 },
  { id: 'dedicated', title: 'مُلتزم', desc: 'تعلمت لمدة 3 أيام متتالية', icon: '🔥', condition: (d) => d.streak >= 3 },
  { id: 'week-warrior', title: 'محارب الأسبوع', desc: 'تعلمت لمدة 7 أيام متتالية', icon: '⚡', condition: (d) => d.streak >= 7 },
  { id: 'exam-pass', title: 'اجتياز الامتحان', desc: 'اجتزت الامتحان النهائي بنجاح', icon: '🎓', condition: (d) => d.examPassed },
  { id: 'note-taker', title: 'كاتب ملاحظات', desc: 'كتبت أول ملاحظة', icon: '📝', condition: (d) => d.notesTaken >= 1 },
  { id: 'half-way', title: 'نص الطريق', desc: 'أكملت 50% من الكورس', icon: '🌟', condition: (d) => d.overallProgress >= 50 },
  { id: 'course-complete', title: 'إتمام الكورس', desc: 'أكملت الكورس بالكامل', icon: '🏅', condition: (d) => d.overallProgress >= 100 },
];

// XP rewards
const XP_REWARDS = {
  visitSection: 5,
  correctAnswer: 15,
  visitProject: 10,
  completeModule: 50,
  examPass: 100,
  writeNote: 5,
  dailyLogin: 10,
};

export function loadGamification() {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

function getDefaultData() {
  return {
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    lastActiveDate: null,
    sectionsVisited: 0,
    correctAnswers: 0,
    projectsVisited: 0,
    examPassed: false,
    notesTaken: 0,
    overallProgress: 0,
    history: [],
  };
}

export function saveGamification(data) {
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
}

export function awardXP(reason) {
  const data = loadGamification();
  const amount = XP_REWARDS[reason] || 0;
  if (amount === 0) return data;

  data.xp += amount;
  data.level = Math.floor(data.xp / 100) + 1;

  // Update counters based on reason
  if (reason === 'visitSection') data.sectionsVisited += 1;
  if (reason === 'correctAnswer') data.correctAnswers += 1;
  if (reason === 'visitProject') data.projectsVisited += 1;
  if (reason === 'examPass') data.examPassed = true;
  if (reason === 'writeNote') data.notesTaken += 1;

  // Update streak
  const today = new Date().toDateString();
  if (data.lastActiveDate) {
    const last = new Date(data.lastActiveDate);
    const diff = Math.floor((new Date(today) - last) / 86400000);
    if (diff === 1) {
      data.streak += 1;
    } else if (diff > 1) {
      data.streak = 1;
    }
  } else {
    data.streak = 1;
  }
  data.lastActiveDate = today;

  // Add to history
  data.history.push({ reason, amount, date: new Date().toISOString() });
  if (data.history.length > 100) data.history = data.history.slice(-100);

  // Check badges
  const newBadges = checkBadges(data);

  saveGamification(data);
  return { ...data, newBadges };
}

export function updateStreak() {
  const data = loadGamification();
  const today = new Date().toDateString();
  if (data.lastActiveDate !== today) {
    if (data.lastActiveDate) {
      const last = new Date(data.lastActiveDate);
      const diff = Math.floor((new Date(today) - last) / 86400000);
      if (diff === 1) {
        data.streak += 1;
      } else if (diff > 1) {
        data.streak = 1;
      }
    } else {
      data.streak = 1;
    }
    data.lastActiveDate = today;
    data.xp += XP_REWARDS.dailyLogin;
    data.level = Math.floor(data.xp / 100) + 1;
    saveGamification(data);
  }
  return data;
}

function checkBadges(data) {
  const newBadges = [];
  for (const badge of BADGE_DEFS) {
    if (!data.badges.includes(badge.id) && badge.condition(data)) {
      data.badges.push(badge.id);
      newBadges.push(badge);
    }
  }
  return newBadges;
}

export function setOverallProgress(percent) {
  const data = loadGamification();
  data.overallProgress = percent;
  checkBadges(data);
  saveGamification(data);
  return data;
}

export function getBadgeDefs() {
  return BADGE_DEFS;
}

export function getUnlockedBadges() {
  const data = loadGamification();
  return BADGE_DEFS.filter((b) => data.badges.includes(b.id));
}

export function getLockedBadges() {
  const data = loadGamification();
  return BADGE_DEFS.filter((b) => !data.badges.includes(b.id));
}

export { XP_REWARDS };
