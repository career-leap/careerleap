import UpcomingTrack from './UpcomingTrack';

export default function PartnershipCollaboration() {
  return (
    <UpcomingTrack
      title="Partnership / Institutional Collaboration"
      subtitle="Work with CareerLeap to support international talent at scale."
      description="For universities, employers, and organisations looking to co-design transition pathways for international students and graduates. We collaborate on curriculum-aligned simulations, employer-ready competence frameworks, and cohort-based readiness programs."
      cohortSize="Custom"
      duration="Custom"
      launchWindow="By arrangement"
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
