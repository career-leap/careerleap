import UpcomingTrack from './UpcomingTrack';

export default function DataBICareerSimulation() {
  return (
    <UpcomingTrack
      title="Data / BI Career Simulation"
      subtitle="Turn raw data into decisions that drive business outcomes."
      description="A structured simulation for aspiring data analysts and business intelligence professionals. Participants work through realistic data pipelines, reporting requests, and stakeholder presentations while building an interview-defendable portfolio of dashboards and analyses."
      cohortSize="10"
      duration="10 weeks"
      launchWindow="Opening Q3 2026"
      expectedSkills={[
        { title: 'Data Cleaning & Transformation', description: 'Prepare messy business data for analysis using industry-standard tools and practices.' },
        { title: 'SQL & Database Queries', description: 'Write efficient queries to extract, aggregate, and validate data from relational databases.' },
        { title: 'Dashboard Design', description: 'Build clear, actionable dashboards that communicate insights to non-technical stakeholders.' },
        { title: 'Business Context', description: 'Translate metrics into business meaning and recommendations.' },
        { title: 'Stakeholder Communication', description: 'Present findings, defend assumptions, and iterate based on feedback.' },
        { title: 'Data Ethics & Governance', description: 'Apply privacy, security, and governance principles to real datasets.' },
      ]}
    />
  );
}
