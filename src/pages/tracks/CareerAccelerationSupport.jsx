import UpcomingTrack from './UpcomingTrack';

export default function CareerAccelerationSupport() {
  return (
    <UpcomingTrack
      title="Career Acceleration Support"
      subtitle="Focused coaching and strategy for your next professional move."
      description="A personalised support track for international talent navigating the German job market. Participants work on CV positioning, interview practice, application strategy, and professional narrative building with expert feedback."
      cohortSize="15"
      duration="4 weeks"
      launchWindow="Rolling admissions"
      expectedSkills={[
        { title: 'CV & LinkedIn Positioning', description: 'Tailor your profile to German employer expectations and ATS requirements.' },
        { title: 'Interview Practice', description: 'Prepare for behavioural, technical, and case-based interviews.' },
        { title: 'Application Strategy', description: 'Build a targeted, high-quality job search plan.' },
        { title: 'Professional Narrative', description: 'Articulate your experience and goals with clarity and confidence.' },
        { title: 'Networking', description: 'Develop outreach and relationship-building habits for the German market.' },
        { title: 'Offer Evaluation', description: 'Assess contracts, compensation, and growth opportunities.' },
      ]}
    />
  );
}
