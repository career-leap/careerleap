import UpcomingTrack from './UpcomingTrack';

const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Business / Operations Analyst Career Simulation",
  "description": "A simulation-focused track for professionals aiming to enter operations, business analysis, or process improvement roles in Germany. Participants map workflows, identify bottlenecks, and implement practical solutions using modern operations tooling.",
  "provider": {
    "@type": "Organization",
    "name": "CareerLeap",
    "sameAs": "https://career-leap.academy"
  },
  "courseCode": "BUS-OPS-DE",
  "educationalLevel": "Career transition / entry-level",
  "teaches": "Process Mapping, Requirements Gathering, Operations Tools, Data-Driven Decisions, Change Communication, Risk Analysis",
  "timeToComplete": "P8W",
  "occupationalCredentialAwarded": "Portfolio experience and team lead reference",
  "inLanguage": "en",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Germany"
  }
};

export default function BusinessOperationsAnalyst() {
  return (
    <UpcomingTrack
      title="Business / Operations Analyst Track"
      subtitle="Optimise processes, reduce friction, and make operations scale."
      description="A simulation-focused track for professionals aiming to enter operations, business analysis, or process improvement roles. Participants map workflows, identify bottlenecks, and implement practical solutions using modern operations tooling."
      cohortSize="10"
      duration="8 weeks"
      launchWindow="Opening Q4 2026"
      seoTitle="Business Operations Analyst Simulation Germany | CareerLeap"
      seoDescription="Learn process mapping, requirements gathering, and operations tooling in a simulated German company. Prepare for analyst roles through real projects."
      schema={schema}
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
