import { useEffect, useState } from 'react';
import ConfettiEffect from '../ConfettiEffect';
import { awardXP } from '../../utils/gamification';

const PASS_PERCENT = 70;

export default function ExamResult({ module, progress, onShowToast }) {
  const totalMcq = module.mcq?.length ?? 0;
  const totalFill = module.complete_code_tests?.length ?? 0;
  const total = totalMcq + totalFill;

  const mcqDone = progress.completed.filter((id) => id.startsWith('mcq-')).length;
  const fillDone = progress.completed.filter((id) => id.startsWith('fill-')).length;
  const correct = mcqDone + fillDone;

  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percent >= PASS_PERCENT;

  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (passed && !celebrated) {
      setCelebrated(true);
      const result = awardXP('examPass');
      if (result.newBadges?.length > 0 && onShowToast) {
        onShowToast(result.newBadges[0]);
      }
    }
  }, [passed, celebrated, onShowToast]);

  return (
    <section className="section">
      <h2 className="section__title">نتيجة الاختبار</h2>
      <div className={`card exam-result ${passed ? 'exam-result--pass' : 'exam-result--pending'}`}>
        <ConfettiEffect active={passed} />
        <div className="exam-result__score animate-scale-in">{percent}%</div>
        <p>
          {correct} من {total} إجابة صحيحة
        </p>
        {passed ? (
          <p className="exam-result__message exam-result__message--pass">
            🎉 مبروك! اجتزت الاختبار — تقدر تبدأ ورشة المشاريع
          </p>
        ) : (
          <p className="exam-result__message">
            تحتاج {PASS_PERCENT}% على الأكثر — راجع اليومين وحاول تاني
          </p>
        )}
        <div className="exam-result__breakdown">
          <span>MCQ: {mcqDone}/{totalMcq}</span>
          <span>أكمل الفراغ: {fillDone}/{totalFill}</span>
        </div>
      </div>
    </section>
  );
}
