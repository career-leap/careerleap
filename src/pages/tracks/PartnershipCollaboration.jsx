import UpcomingTrack from './UpcomingTrack';

const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Partnership / Institutional Collaboration",
  "description": "For universities, employers, and organisations looking to co-design transition pathways for international students and graduates in Germany. We collaborate on curriculum-aligned simulations, employer-ready competence frameworks, and cohort-based readiness programs.",
  "provider": {
    "@type": "Organization",
    "name": "CareerLeap",
    "sameAs": "https://career-leap.academy"
  },
  "courseCode": "PARTNER-DE",
  "educationalLevel": "Institutional / partnership",
  "teaches": "Curriculum Alignment, Competence Frameworks, Cohort Design, Progress Reporting, Pipeline Development",
  "timeToComplete": "Custom",
  "occupationalCredentialAwarded": "Employer-ready competence framework and progress report",
  "inLanguage": "en",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Germany"
  }
};

export default function PartnershipCollaboration() {
  return (
    <UpcomingTrack
      title="Partnership / Institutional Collaboration"
      subtitle="Work with CareerLeap to support international talent at scale."
      description="For universities, employers, and organisations looking to co-design transition pathways for international students and graduates. We collaborate on curriculum-aligned simulations, employer-ready competence frameworks, and cohort-based readiness programs."
      cohortSize="Custom"
      duration="Custom"
      launchWindow="By arrangement"
      seoTitle="University & Employer Career Simulation Partnerships | CareerLeap"
      seoDescription="Partner with CareerLeap to design curriculum-aligned simulations and employer-ready talent pipelines for international students in Germany."
      schema={schema}
      expectedSkills={[
        { title: 'Curriculum Alignment', description: 'Map simulations to academic outcomes and employability goals.' },
        { title: 'Competence Frameworks', description: 'Define the skills and behaviours your organisation needs.' },
        { title: 'Cohort Design', description: 'Structure simulations around real role expectations and hiring criteria.' },
        { title: 'Progress Reporting', description: 'Track participant readiness with structured evaluation metrics.' },
        { title: 'Mentor Network Access', description: 'Tap into a network of industry professionals for supervision.' },
        { title: 'Pipeline Development', description: 'Build a sustainable path from education to employment.' },
      ]}
    />
  );
}
