import UpcomingTrack from './UpcomingTrack';

const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Mentor / Expert Support",
  "description": "Book focused 1-on-1 sessions with industry experts for targeted advice, mock interviews, CV reviews, or technical deep dives. Ideal when you need external perspective from someone who understands your target role and the German market.",
  "provider": {
    "@type": "Organization",
    "name": "CareerLeap",
    "sameAs": "https://career-leap.academy"
  },
  "courseCode": "MENTOR-EXPERT-DE",
  "educationalLevel": "Career transition / all levels",
  "teaches": "CV Reviews, Mock Interviews, Technical Deep Dives, Career Strategy, Industry Insights, Accountability",
  "timeToComplete": "Per session",
  "occupationalCredentialAwarded": "Targeted feedback and action plan",
  "inLanguage": "en",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Germany"
  }
};

export default function MentorExpertSupport() {
  return (
    <UpcomingTrack
      title="Mentor / Expert Support"
      subtitle="1-on-1 guidance from professionals who have done the work."
      description="Book focused sessions with industry experts for targeted advice, mock interviews, CV reviews, or technical deep dives. This track is ideal when you need external perspective from someone who understands your target role and market."
      cohortSize="1-on-1"
      duration="Per session"
      launchWindow="Available now"
      seoTitle="1-on-1 Career Mentoring for Germany Job Market | CareerLeap"
      seoDescription="Book focused sessions with industry experts for CV reviews, mock interviews, and technical deep dives. Targeted guidance for your German career transition."
      schema={schema}
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
