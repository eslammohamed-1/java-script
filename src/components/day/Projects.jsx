import CodeTabs from '../shared/CodeTabs';
import ProjectLab from '../shared/ProjectLab';

function ProjectCard({ project, index, lessonId }) {
  const starter = {
    html: project.html ?? '',
    css: project.css ?? '',
    javascript: '',
  };
  const solution = {
    html: project.html ?? '',
    css: project.css ?? '',
    javascript: project.javascript ?? '',
  };

  return (
    <div className="card">
      <h3 className="card__title">
        {index + 1}. {project.name}
      </h3>
      <ul className="requirements-list">
        {project.requirements.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>

      <ProjectLab
        storageKey={`${lessonId}-${project.name}`}
        starter={starter}
        solution={solution}
        title={`طبّق: ${project.name}`}
      />

      <CodeTabs
        example={{
          html: project.html,
          css: project.css,
          javascript: project.javascript,
        }}
      />
    </div>
  );
}

export default function Projects({ projects, lessonId }) {
  return (
    <section className="section">
      <h2 className="section__title">المشاريع</h2>
      <p className="section__subtitle">{projects.length} مشروع</p>
      {projects.map((project, i) => (
        <ProjectCard key={i} project={project} index={i} lessonId={lessonId} />
      ))}
    </section>
  );
}
