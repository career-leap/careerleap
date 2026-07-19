import UpcomingTrack from './UpcomingTrack';

const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Data / BI Career Simulation",
  "description": "A structured simulation for aspiring data analysts and business intelligence professionals in Germany. Participants work through realistic data pipelines, reporting requests, and stakeholder presentations while building an interview-defendable portfolio of dashboards and analyses.",
  "provider": {
    "@type": "Organization",
    "name": "CareerLeap",
    "sameAs": "https://career-leap.academy"
  },
  "courseCode": "DATA-BI-DE",
  "educationalLevel": "Career transition / entry-level",
  "teaches": "SQL, Data Cleaning, Dashboard Design, Power BI, Tableau, Business Context, Stakeholder Communication, Data Ethics",
  "timeToComplete": "P10W",
  "occupationalCredentialAwarded": "Portfolio experience and team lead reference",
  "inLanguage": "en",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Germany"
  }
};

export default function DataBICareerSimulation() {
  return (
    <UpcomingTrack
      title="Data / BI Career Simulation"
      subtitle="Turn raw data into decisions that drive business outcomes."
      description="A structured simulation for aspiring data analysts and business intelligence professionals. Participants work through realistic data pipelines, reporting requests, and stakeholder presentations while building an interview-defendable portfolio of dashboards and analyses."
      cohortSize="10"
      duration="10 weeks"
      launchWindow="Opening Q3 2026"
      seoTitle="Data & BI Career Simulation Germany | CareerLeap"
      seoDescription="Build dashboards, SQL queries, and data models in a German job market simulation. Get hands-on analytics experience for data analyst and BI roles."
      schema={schema}
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
