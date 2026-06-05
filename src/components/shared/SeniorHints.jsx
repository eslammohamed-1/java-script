import LessonContent from './LessonContent';
import { hasLessonMarkup } from '../../utils/parseLessonMarkup';

function normalizeHint(hint) {
  if (typeof hint === 'string') {
    return { title: null, explanation: hint, practice: null };
  }
  return {
    title: hint.title ?? null,
    explanation: hint.explanation ?? '',
    practice: hint.practice ?? null,
  };
}

export default function SeniorHints({ hints, title = 'شرح احترافي' }) {
  if (!hints?.length) return null;

  return (
    <div className="senior-hints">
      <div className="senior-hints__header">
        <span className="senior-hints__icon">★</span>
        <span className="senior-hints__title">{title}</span>
      </div>
      <div className="senior-hints__list">
        {hints.map((raw, i) => {
          const hint = normalizeHint(raw);
          return (
            <article key={i} className="senior-hints__card">
              {hint.title && (
                <h4 className="senior-hints__card-title">{hint.title}</h4>
              )}
              {hasLessonMarkup(hint.explanation) ? (
                <LessonContent
                  text={hint.explanation}
                  className="senior-hints__rich"
                />
              ) : (
                <p className="senior-hints__card-text">{hint.explanation}</p>
              )}
              {hint.practice && (
                <p className="senior-hints__card-practice">
                  <strong>تطبيق عملي:</strong> {hint.practice}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
