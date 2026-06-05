import { useState, useEffect } from 'react';
import { loadGamification, getBadgeDefs } from '../utils/gamification';
import { loadProgress, calcDayProgress, calcWorkshopProgress } from '../utils/progress';
import { lessons, progressKey } from '../data/lessons';

export default function Dashboard({ onStartLesson, onShowToast }) {
  const [data, setData] = useState(() => loadGamification());
  const badges = getBadgeDefs();

  useEffect(() => {
    setData(loadGamification());
  }, []);

  const nextLevelXp = data.level * 100;
  const currentLevelXp = data.xp - (data.level - 1) * 100;
  const xpPercent = Math.min(100, (currentLevelXp / 100) * 100);

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard__welcome">
        <h1>أهلاً بك في لوحة المتابعة</h1>
        <p>استمر في التعلم، إنجازاتك بتزيد كل يوم!</p>
        <div className="dashboard__streak">
          🔥 {data.streak} أيام متتالية
        </div>
      </div>

      <div className="dashboard__xp-section">
        <div className="dashboard__xp-header">
          <span className="dashboard__level">مستوى {data.level}</span>
          <span className="dashboard__xp-text">{currentLevelXp} / 100 خبرة للمستوى القادم</span>
        </div>
        <div className="dashboard__xp-bar">
          <div className="dashboard__xp-fill" style={{ width: `${xpPercent}%` }}></div>
        </div>
      </div>

      <div className="dashboard__stats-grid">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon">✅</div>
          <div className="dashboard__stat-value">{data.correctAnswers}</div>
          <div className="dashboard__stat-label">إجابة صحيحة</div>
        </div>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon">📚</div>
          <div className="dashboard__stat-value">{data.sectionsVisited}</div>
          <div className="dashboard__stat-label">قسم مكتمل</div>
        </div>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon">💻</div>
          <div className="dashboard__stat-value">{data.projectsVisited}</div>
          <div className="dashboard__stat-label">مشروع مطبق</div>
        </div>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon">📝</div>
          <div className="dashboard__stat-value">{data.notesTaken}</div>
          <div className="dashboard__stat-label">ملاحظة مكتوبة</div>
        </div>
      </div>

      <h2 className="dashboard__section-title">إنجازاتك (Badges)</h2>
      <div className="dashboard__badges-grid">
        {badges.map(badge => {
          const unlocked = data.badges.includes(badge.id);
          return (
            <div key={badge.id} className={`dashboard__badge ${!unlocked ? 'dashboard__badge--locked' : ''}`} title={badge.desc}>
              <div className="dashboard__badge-icon">{badge.icon}</div>
              <div className="dashboard__badge-title">{badge.title}</div>
              <div className="dashboard__badge-desc">{badge.desc}</div>
            </div>
          );
        })}
      </div>

      <h2 className="dashboard__section-title">آخر النشاطات</h2>
      <div className="dashboard__activity-feed">
        {data.history.slice().reverse().slice(0, 5).map((act, i) => (
          <div key={i} className="dashboard__activity-item">
            <span className="dashboard__activity-xp">+{act.amount} XP</span>
            <span>
              {act.reason === 'visitSection' && 'أكملت قراءة قسم'}
              {act.reason === 'correctAnswer' && 'أجبت على سؤال بشكل صحيح'}
              {act.reason === 'visitProject' && 'تدربت على مشروع'}
              {act.reason === 'examPass' && 'اجتزت امتحان بنجاح'}
              {act.reason === 'writeNote' && 'كتبت ملاحظة مهمة'}
              {act.reason === 'dailyLogin' && 'تسجيل دخول يومي'}
            </span>
            <span style={{color: 'var(--text-muted)', fontSize: '0.75rem', marginRight: 'auto'}}>
              {new Date(act.date).toLocaleDateString('ar-EG')}
            </span>
          </div>
        ))}
        {data.history.length === 0 && <p style={{color: 'var(--text-muted)'}}>لا توجد نشاطات بعد.</p>}
      </div>
    </div>
  );
}
