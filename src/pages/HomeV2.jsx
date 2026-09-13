import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchemaScript from '../components/SchemaScript';
import {
  Users,
  Briefcase,
  LineChart,
  Megaphone,
  Server,
  Target,
  Award,
  Globe,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Building2,
  GraduationCap,
  Quote,
  Camera,
} from 'lucide-react';
import CalendlyButton from '../components/CalendlyButton';
import angelaPhoto from '../assets/testimonials/angela.jpg';

const TEAM_CARDS = [
  {
    icon: Server,
    title: 'IT Infrastructure & Support',
    description:
      'Manage Microsoft 365 environments, user access, device provisioning, and internal support tickets just like an IT operations team.',
    skills: ['Microsoft 365', 'Identity Management', 'Ticketing', 'IT Security Basics'],
  },
  {
    icon: LineChart,
    title: 'Data Analytics & Engineering',
    description:
      'Build dashboards, clean datasets, and support data-driven decisions across the simulated company.',
    skills: ['SQL', 'Power BI / Tableau', 'Python', 'Data Modeling'],
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing & Content',
    description:
      'Run campaigns, create content, manage social channels, and report on marketing performance.',
    skills: ['Content Strategy', 'SEO', 'Social Media', 'Marketing Analytics'],
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Join as a Junior Team Member',
    description:
      'You are placed in a team that mirrors a real department. You report to an industry professional who assigns real tasks.',
  },
  {
    step: '02',
    title: 'Work on Real Company Tasks',
    description:
      'For 3–4 months you contribute to projects, attend team standups, and deliver work that goes into a portfolio.',
  },
  {
    step: '03',
    title: 'Get Career Coaching',
    description:
      'Receive CV reviews, LinkedIn optimization, interview coaching, and job-search strategy tailored to the German market.',
  },
  {
    step: '04',
    title: 'Apply with Confidence',
    description:
      'Leave with hands-on experience, references from team leads, and a clear narrative for German employers.',
  },
];

const DIFFERENTIATORS = [
  {
    icon: Building2,
    title: 'Real Company Structure',
    description: 'Not a classroom. You work inside a simulated company with departments, leads, and deliverables.',
  },
  {
    icon: Users,
    title: 'Industry Professionals as Leads',
    description: 'Every team is led by someone currently working in the field, not just a teacher.',
  },
  {
    icon: Target,
    title: 'German Job Market Focus',
    description: 'CVs, applications, and coaching are tailored to how hiring actually works in Germany.',
  },
  {
    icon: Award,
    title: 'Portfolio + References',
    description: 'Finish with documented work experience and a reference from your team lead.',
  },
];

const TESTIMONIALS = [
  {
    photo: angelaPhoto,
    name: 'Angela',
    role: 'IT Infrastructure & DevOps Intern',
    tag: 'Intern',
    tagColor:
      'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30',
    quote:
      'What I value most is having a supportive environment where I am not expected to figure everything out on my own. I am learning through real tasks, putting my knowledge into practice, and gradually building the confidence and experience I need to find my feet in the German job market.',
    highlight:
      'For me, CareerLeap is more than just an internship experience — it is a place where I can contribute while being supported in my own professional journey.',
  },
  {
    initials: 'P',
    name: 'Prince',
    role: 'IT System Administration',
    tag: 'Pilot Graduate',
    tagColor:
      'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-900/30',
    quote:
      'The CareerLeap IT Systems Administration Pilot took me beyond theory — building real automation tools gave me the hands-on confidence and proof of skill I needed to move my career forward. It’s project-based rather than just theoretical, so you walk away with real, demonstrable work like automation scripts and device management exercises.',
    highlight:
      'That’s especially valuable if you are trying to break into or move up in IT administration and need concrete proof of hands-on skills for employers.',
  },
  {
    initials: 'D',
    name: 'Deborah',
    role: 'IT Systems Administration Pilot',
    tag: 'Landed a job',
    tagColor:
      'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30',
    quote:
      'I joined the pilot to learn new skills and refresh the ones I already had. The most valuable part was the career advice and job-seeking support — I gained real insights into the German job market.',
    highlight: 'I would recommend it to anyone: it’s great for learning and networking.',
  },
];

function CTABanner({
  title = 'Ready to start your career simulation?',
  subtitle = 'Apply for the next cohort or book a free info session to ask questions.',
  variant = 'light',
  showApply = true,
}) {
  const isDark = variant === 'dark';
  return (
    <div
      className={`max-w-5xl mx-auto rounded-2xl p-8 md:p-12 text-center ${
        isDark
          ? 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white'
          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
      }`}
    >
      <h3
        className={`text-2xl md:text-3xl font-extrabold mb-4 ${
          isDark ? 'text-white' : 'text-slate-900 dark:text-white'
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-lg mb-8 max-w-2xl mx-auto ${
          isDark ? 'text-teal-100' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        {showApply && (
          <Link
            to="/contact"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 ${
              isDark
                ? 'bg-white text-teal-600'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
            }`}
          >
            Apply for Next Cohort
            <ArrowRight size={20} />
          </Link>
        )}
        <CalendlyButton
          variant="outline"
          className={`text-lg justify-center ${
            isDark
              ? 'border-white text-white hover:bg-white hover:text-teal-600'
              : ''
          }`}
          showIcon={false}
        >
          Book an Info Session
        </CalendlyButton>
      </div>
    </div>
  );
}

export default function HomeV2() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "CareerLeap",
        "url": "https://career-leap.academy",
        "logo": "https://career-leap.academy/image.png",
        "description": "Germany's career simulation platform for international professionals entering IT, Data, and Operations roles.",
        "sameAs": [
          "https://career-leap.academy"
        ]
      },
      {
        "@type": "WebSite",
        "name": "CareerLeap",
        "url": "https://career-leap.academy",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://career-leap.academy/career-tracks?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pb-24 md:pb-0">
      <Helmet>
        <title>CareerLeap | Real Company Simulation for Career Transition in Germany</title>
        <meta name="description" content="Join a 3–4 month career simulation in IT, Data, or Marketing. Work as a junior team member, report to industry professionals, and build the experience German employers want." />
      </Helmet>
      <SchemaScript schema={schema} />
      {/* Hero */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-teal-950 dark:via-slate-900 dark:to-amber-950 -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Building2 size={16} />
                A simulated company for career transition
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                Learn on the job.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-amber-500">
                  Before the job.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
                Join a 3–4 month career simulation. Step into a junior role in IT,
                Data, or Marketing, report to an industry professional, and build
                the experience German employers actually want.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Apply for Next Cohort
                  <ArrowRight size={20} />
                </Link>
                <CalendlyButton variant="outline" className="text-lg" showIcon={false}>
                  Book an Info Session
                </CalendlyButton>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  3–4 months
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Real team tasks
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  German market focus
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white">CareerLeap Org</h3>
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded-full">
                    Upcoming
                  </span>
                </div>
                <div className="space-y-4">
                  {TEAM_CARDS.map((team, index) => (
                    <div
                      key={team.title}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-gray-700/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                        <team.icon size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {team.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {team.skills.slice(0, 2).join(' · ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <Users size={14} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-slate-900 dark:text-white">Team Lead</span>{' '}
                      assigns tasks ·{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">Junior</span>{' '}
                      delivers work
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-12 bg-teal-900 dark:bg-teal-950 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Simulation Teams', value: '3+' },
              { label: 'Program Duration', value: '3–4 Mo' },
              { label: 'Career Coaching', value: 'Included' },
              { label: 'Job Market', value: 'Germany' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-extrabold text-teal-300">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full mb-4">
              Participant Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Real People. Real Growth.
            </h2>
          </div>

          {/* Lead pull-quote from a CareerLeap volunteer/intern */}
          <figure className="max-w-3xl mx-auto text-center mb-14">
            <blockquote className="text-xl md:text-2xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              “Being part of CareerLeap has given me the opportunity to{' '}
              <span className="text-teal-600 dark:text-teal-400">learn, contribute, and grow</span>{' '}
              at the same time. As a volunteer/intern, I get to share my knowledge and skills with
              the team while also gaining hands-on experience and practical guidance.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
              — CareerLeap Volunteer &amp; Intern
            </figcaption>
          </figure>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, index) => (
              <motion.article
                key={t.name}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="absolute -top-5 left-8 bg-gradient-to-br from-teal-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <Quote size={18} className="text-white" fill="white" />
                </span>

                <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed mb-8 mt-2">
                  “{t.quote}
                  <span className="block mt-3 text-slate-900 dark:text-white font-medium">
                    {t.highlight}”
                  </span>
                </p>

                <footer className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500/40 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    />
                  ) : (
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-teal-500/40 ring-offset-2 ring-offset-white dark:ring-offset-gray-800">
                      {t.initials}
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                        <Camera size={10} className="text-gray-400" />
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </footer>
                <span
                  className={`mt-4 self-start text-xs font-medium px-2.5 py-1 rounded-full ${t.tagColor}`}
                >
                  {t.tag}
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA after testimonials */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900 transition-colors">
        <CTABanner
          title="Join the participants who turned simulation into employment"
          subtitle="Apply for the next cohort or book a free info session to learn more."
        />
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-amber-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              How the Simulation Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Not a course. Not a bootcamp. A structured work experience inside a simulated company.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, index) => (
              <motion.div
                key={item.step}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="text-4xl font-extrabold text-teal-100 dark:text-teal-900/40">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA after how it works */}
      <section className="py-12 px-4 bg-amber-50 dark:bg-slate-900 transition-colors">
        <CTABanner
          title="Ready to work like a junior team member?"
          subtitle="Join the next cohort and start building real company experience in Germany."
          variant="dark"
        />
      </section>

      {/* Teams */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Choose Your Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Each team functions like a real department. You contribute, collaborate, and learn by doing.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM_CARDS.map((team, index) => (
              <motion.div
                key={team.title}
                className="bg-slate-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6">
                  <team.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {team.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {team.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {team.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-300 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA after teams */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900 transition-colors">
        <CTABanner
          title="Pick the team that fits your career goal"
          subtitle="Apply now or book an info session to discuss IT, Data, and Marketing tracks."
        />
      </section>

      {/* Differentiators */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Why This Is Different From a Bootcamp
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Bootcamps teach skills. We train you to operate inside a company.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((item, index) => (
              <motion.div
                key={item.title}
                className="flex gap-4 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={24} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA after differentiators */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-800 transition-colors">
        <CTABanner
          title="Not a bootcamp. Real work experience."
          subtitle="Get the portfolio, references, and confidence German employers are looking for."
          variant="dark"
        />
      </section>

      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex gap-3">
          <Link
            to="/contact"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
          >
            Apply
            <ArrowRight size={16} />
          </Link>
          <CalendlyButton
            variant="outline"
            className="flex-1 text-sm justify-center px-4 py-3"
            showIcon={false}
          >
            Info Session
          </CalendlyButton>
        </div>
      </div>

    </div>
  );
}
