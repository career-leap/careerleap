import UpcomingTrack from './UpcomingTrack';

export default function MentorExpertSupport() {
  return (
    <UpcomingTrack
      title="Mentor / Expert Support"
      subtitle="1-on-1 guidance from professionals who have done the work."
      description="Book focused sessions with industry experts for targeted advice, mock interviews, CV reviews, or technical deep dives. This track is ideal when you need external perspective from someone who understands your target role and market."
      cohortSize="1-on-1"
      duration="Per session"
      launchWindow="Available now"
      expectedSkills={[
        { title: 'Targeted Feedback', description: 'Get specific input on your CV, portfolio, or interview approach.' },
        { title: 'Industry Insights', description: 'Learn what hiring managers actually look for in your field.' },
        { title: 'Mock Interviews', description: 'Practise under realistic conditions with actionable debriefs.' },
        { title: 'Technical Deep Dives', description: 'Clarify concepts or tools relevant to your target role.' },
        { title: 'Career Strategy', description: 'Discuss transitions, specialisations, and long-term positioning.' },
        { title: 'Accountability', description: 'Set goals and follow up with structured guidance.' },
      ]}
    />
  );
}
