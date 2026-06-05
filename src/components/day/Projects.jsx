import CodeTabs from '../shared/CodeTabs';

function ProjectCard({ project, index }) {
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

export default function Projects({ projects }) {
  return (
    <section className="section">
      <h2 className="section__title">المشاريع</h2>
      <p className="section__subtitle">{projects.length} مشروع</p>
      {projects.map((project, i) => (
        <ProjectCard key={i} project={project} index={i} />
      ))}
    </section>
  );
}
