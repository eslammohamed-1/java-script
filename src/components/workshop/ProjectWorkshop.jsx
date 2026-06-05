import { useMemo, useState } from 'react';
import AnnotatedCodeBlock from './AnnotatedCodeBlock';
import ProjectLab from '../shared/ProjectLab';
import SeniorHints from '../shared/SeniorHints';
import {
  extractProjectCode,
  extractStarterCode,
} from '../../utils/extractProjectCode';

function ChecklistModal({ items, onClose, onComplete }) {
  const [checked, setChecked] = useState({});

  const allDone = items.every((_, i) => checked[i]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal__close" onClick={onClose}>
          ×
        </button>
        <h3 className="modal__title">قائمة الاختبار</h3>
        <ul className="checklist">
          {items.map((item, i) => (
            <li key={i}>
              <input
                type="checkbox"
                id={`check-${i}`}
                checked={!!checked[i]}
                onChange={() =>
                  setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
                }
              />
              <label htmlFor={`check-${i}`}>{item}</label>
            </li>
          ))}
        </ul>
        {allDone && (
          <button
            type="button"
            className="btn btn--primary"
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => {
              onComplete();
              onClose();
            }}
          >
            تم إكمال القائمة ✓
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProjectWorkshop({
  project,
  lessonId,
  onAnnotate,
  onChecklistDone,
}) {
  const [hideSolution, setHideSolution] = useState(false);
  const [showSeniorHints, setShowSeniorHints] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const starter = useMemo(
    () => extractStarterCode(project.codeBlocks),
    [project.codeBlocks]
  );
  const solution = useMemo(
    () => extractProjectCode(project.codeBlocks),
    [project.codeBlocks]
  );

  const allSeniorNotes = project.codeBlocks?.flatMap((b) =>
    (b.annotations ?? []).map((a) => ({
      block: b.title,
      note: a.seniorNote,
      title: a.title,
    }))
  ).filter((n) => n.note);

  return (
    <section className="section">
      <h2 className="section__title">{project.name}</h2>

      <div className="meta-grid">
        <div className="meta-item">
          <div className="meta-item__label">الوقت المقدر</div>
          <div className="meta-item__value">{project.estimatedTime}</div>
        </div>
        <div className="meta-item">
          <div className="meta-item__label">الهدف</div>
          <div className="meta-item__value">{project.goal}</div>
        </div>
      </div>

      <div className="chips">
        {project.skills?.map((skill) => (
          <span key={skill} className="chip chip--skill">
            {skill}
          </span>
        ))}
      </div>

      <div className="btn-group">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setHideSolution((v) => !v)}
        >
          {hideSolution ? 'إظهار الحل' : 'إخفاء الحل'}
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setShowSeniorHints((v) => !v)}
        >
          {showSeniorHints ? 'إخفاء التلميحات' : 'تلميحات احترافية'}
        </button>
        {project.testingChecklist?.length > 0 && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setShowChecklist(true)}
          >
            قائمة الاختبار
          </button>
        )}
      </div>

      <div className="card">
        <h3 className="card__title">المتطلبات</h3>
        <ul className="requirements-list">
          {project.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>

      {project.build_steps?.length > 0 && (
        <div className="card">
          <h3 className="card__title">خطوات البناء</h3>
          <ol className="steps-list">
            {project.build_steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <ProjectLab
        storageKey={`${lessonId}-${project.id}`}
        starter={starter}
        solution={hideSolution ? null : solution}
        title={`طبّق: ${project.name}`}
      />

      {showSeniorHints && allSeniorNotes?.length > 0 && (
        <SeniorHints
          title="تلميحات من الكود"
          hints={allSeniorNotes.map((n) => ({
            title: n.title,
            explanation: n.note,
            practice: n.block ? `من قسم: ${n.block}` : null,
          }))}
        />
      )}

      {!hideSolution &&
        project.codeBlocks?.map((block) => (
          <AnnotatedCodeBlock
            key={block.id}
            block={block}
            onAnnotate={onAnnotate}
          />
        ))}

      {project.challenges?.length > 0 && (
        <div className="card">
          <h3 className="card__title">تحديات إضافية</h3>
          <ul className="requirements-list">
            {project.challenges.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {showChecklist && (
        <ChecklistModal
          items={project.testingChecklist}
          onClose={() => setShowChecklist(false)}
          onComplete={onChecklistDone}
        />
      )}
    </section>
  );
}
