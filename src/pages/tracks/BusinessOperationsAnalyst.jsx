import UpcomingTrack from './UpcomingTrack';

export default function BusinessOperationsAnalyst() {
  return (
    <UpcomingTrack
      title="Business / Operations Analyst Track"
      subtitle="Optimise processes, reduce friction, and make operations scale."
      description="A simulation-focused track for professionals aiming to enter operations, business analysis, or process improvement roles. Participants map workflows, identify bottlenecks, and implement practical solutions using modern operations tooling."
      cohortSize="10"
      duration="8 weeks"
      launchWindow="Opening Q4 2026"
      expectedSkills={[
        { title: 'Process Mapping', description: 'Document and visualise end-to-end business workflows.' },
        { title: 'Requirement Gathering', description: 'Elicit, prioritise, and validate business requirements from stakeholders.' },
        { title: 'Operations Tools', description: 'Use project management and workflow platforms to track and improve operations.' },
        { title: 'Data-Driven Decisions', description: 'Support operational recommendations with metrics and analysis.' },
        { title: 'Change Communication', description: 'Document and present process changes to cross-functional teams.' },
        { title: 'Risk & Bottleneck Analysis', description: 'Identify failure points and propose mitigations.' },
      ]}
    />
  );
}
