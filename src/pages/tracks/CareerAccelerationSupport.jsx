import UpcomingTrack from './UpcomingTrack';

const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Career Acceleration Support",
  "description": "A personalised support track for international talent navigating the German job market. Participants work on CV positioning, interview practice, application strategy, and professional narrative building with expert feedback.",
  "provider": {
    "@type": "Organization",
    "name": "CareerLeap",
    "sameAs": "https://career-leap.academy"
  },
  "courseCode": "CAREER-ACCEL-DE",
  "educationalLevel": "Career transition / entry-level",
  "teaches": "CV Positioning, LinkedIn Optimisation, Interview Practice, Application Strategy, German Job Market, Professional Narrative, Networking",
  "timeToComplete": "P4W",
  "occupationalCredentialAwarded": "Career coaching plan and job search strategy",
  "inLanguage": "en",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Germany"
  }
};

export default function CareerAccelerationSupport() {
  return (
    <UpcomingTrack
      title="Career Acceleration Support"
      subtitle="Focused coaching and strategy for your next professional move."
      description="A personalised support track for international talent navigating the German job market. Participants work on CV positioning, interview practice, application strategy, and professional narrative building with expert feedback."
      cohortSize="15"
      duration="4 weeks"
      launchWindow="Rolling admissions"
      seoTitle="Career Coaching for International Graduates in Germany | CareerLeap"
      seoDescription="CV positioning, interview practice, and German job market strategy for international students and recent graduates. One-on-one and small-group support."
      schema={schema}
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
