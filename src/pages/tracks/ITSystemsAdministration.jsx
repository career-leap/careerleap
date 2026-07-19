import { Helmet } from 'react-helmet-async';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SchemaScript from '../../components/SchemaScript';
import { 
  Users, 
  Monitor, 
  Clock, 
  ClipboardList, 
  Workflow, 
  KeyRound, 
  Shield, 
  Lock, 
  UserMinus, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const TrackModuleCard = ({ icon: Icon, title, description, tag, index }) => (
  <motion.div
    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 h-full"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shrink-0">
        <Icon size={22} />
      </div>
      <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
        {tag}
      </span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const OutcomeItem = ({ title, index }) => (
  <motion.div 
    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center shrink-0">
      <CheckCircle size={18} className="text-teal-600 dark:text-teal-400" />
    </div>
    <span className="text-slate-700 dark:text-gray-300 font-medium">{title}</span>
  </motion.div>
);

const FAQItem = ({ question, answer, index }) => (
  <motion.div
    className="bg-slate-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{question}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
  </motion.div>
);

export default function CareerTracks() {
  const modules = [
    {
      icon: ClipboardList,
      title: 'Ticketing Tool',
      description: 'Build a service desk solution using Microsoft Planner and Power Automate to track and route internal requests.',
      tag: 'Service Desk',
    },
    {
      icon: Workflow,
      title: 'User Onboarding Automation',
      description: 'Automate account provisioning and resource assignment for new hires joining the organisation.',
      tag: 'Automation',
    },
    {
      icon: KeyRound,
      title: 'Self-Service Password Reset',
      description: 'Build a password reset service and custom portal so users can recover access securely without IT intervention.',
      tag: 'Identity',
    },
    {
      icon: Shield,
      title: 'Security Posture',
      description: 'Define best practices for organisational security, including baselines, hardening, and compliance checks.',
      tag: 'Security',
    },
    {
      icon: Monitor,
      title: 'Device Management with Intune',
      description: 'Onboard user devices into a Microsoft 365 tenant and enforce policies through Microsoft Intune.',
      tag: 'Endpoint',
    },
    {
      icon: Lock,
      title: 'Conditional Access Policies',
      description: 'Learn, design, and implement conditional access policies that protect organisational resources.',
      tag: 'Identity',
    },
    {
      icon: UserMinus,
      title: 'Automated Off-Boarding',
      description: 'Create a workflow that disables access to all organisational resources when a user leaves.',
      tag: 'Automation',
    },
    {
      icon: FileText,
      title: 'Disaster Recovery Document',
      description: 'Develop a working disaster recovery plan for a Microsoft 365 tenant, covering recovery objectives and runbooks.',
      tag: 'Business Continuity',
    },
    {
      icon: AlertTriangle,
      title: 'Critical Incident Simulation',
      description: 'Respond to simulated critical incidents such as user permissions lockout, working within a 30-minute SLA.',
      tag: 'Incident Response',
    },
  ];

  const outcomes = [
    'Configure and manage a Microsoft 365 tenant',
    'Automate user lifecycle workflows with Power Automate',
    'Implement identity and access controls with conditional access',
    'Enroll and manage devices using Microsoft Intune',
    'Document security baselines and disaster recovery procedures',
    'Respond to critical incidents under SLA pressure',
  ];

  const audience = [
    {
      title: 'International graduates in Germany',
      description: 'You have a degree in IT, computer science, or a related field and need German workplace experience to compete for entry-level roles.',
    },
    {
      title: 'Career changers',
      description: 'You are switching into IT operations or cloud administration and need hands-on projects that prove you can do the work.',
    },
    {
      title: 'Self-taught IT professionals',
      description: 'You have learned the theory from courses or certifications and now need structured practice with real M365 environments.',
    },
  ];

  const faqs = [
    {
      question: 'Is this a bootcamp or a certification course?',
      answer: 'Neither. CareerLeap is a work simulation. You join a team, receive tasks from a team lead, and deliver real systems and documentation. You leave with portfolio work and a reference, not a certificate.',
    },
    {
      question: 'Do I need prior IT experience?',
      answer: 'Some baseline familiarity with IT concepts is helpful, but the simulation is designed for people transitioning into IT operations. The team lead guides you through the tools and workflows.',
    },
    {
      question: 'How is this different from free virtual work experiences?',
      answer: 'Free simulators are usually self-paced and automated. CareerLeap gives you accountability, deadlines, feedback from a real industry professional, and a reference attesting to your work.',
    },
    {
      question: 'Will this help me get a job in Germany?',
      answer: 'The track is built around the skills German employers ask for in IT support, systems administration, and M365 operations roles. You also receive coaching on CVs, interviews, and applications tailored to the German market.',
    },
    {
      question: 'Can I do this while working or studying?',
      answer: 'The simulation requires 3–4 months of active participation, including team standups and task delivery. Many participants combine it with part-time work or study, but you should plan for consistent weekly commitment.',
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "IT Systems Administration Career Simulation",
    "description": "A 3–4 month hands-on simulation that prepares participants for real workplace IT operations in Microsoft 365 environments in Germany.",
    "provider": {
      "@type": "Organization",
      "name": "CareerLeap",
      "sameAs": "https://career-leap.academy"
    },
    "courseCode": "IT-ADMIN-DE",
    "educationalLevel": "Career transition / entry-level",
    "teaches": "Microsoft 365, Intune, Identity Management, Conditional Access, IT Security, Ticketing, Automation, Disaster Recovery, Incident Response",
    "timeToComplete": "P3M",
    "occupationalCredentialAwarded": "Portfolio experience and team lead reference",
    "inLanguage": "en",
    "availableAtOrFrom": {
      "@type": "Place",
      "name": "Germany"
    }
  };

  return (
    <div>
      <Helmet>
        <title>IT Systems Administration Work Experience Germany | CareerLeap</title>
        <meta name="description" content="Join a 3–4 month IT work simulation in Germany. Learn Microsoft 365, Intune, identity management, and security through real team tasks. Build a portfolio German employers value." />
      </Helmet>
      <SchemaScript schema={schema} />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Completed — Pilot Cohort
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              IT Systems Administration
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              A hands-on simulation track that prepares participants for real workplace IT operations in Microsoft 365 environments.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Through supervised cohort-based projects, you will build, document, and defend the kind of systems that IT administrators manage every day.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Join the Next Cohort
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Track Overview */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Cohort Size', value: '5 Participants' },
              { icon: Monitor, label: 'Focus Area', value: 'Microsoft 365 IT Administration' },
              { icon: Clock, label: 'Format', value: 'Supervised Simulation' },
              { icon: CheckCircle, label: 'Progress', value: '100% Complete' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-slate-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  <stat.icon size={24} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <motion.div 
            className="mt-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              <span>Cohort progress</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: '100%' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-20 px-4 bg-amber-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Who Is This Track For?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              This simulation is designed for people who need practical IT operations experience to break into the German job market.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {audience.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
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

      {/* Modules Grid */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto mb-6" />
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              What You Will Build
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Practical systems and workflows aligned with real IT operations roles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <TrackModuleCard key={index} {...module} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-6" />
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                By the End of This Track
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                You will have documented, interview-defendable experience administering Microsoft 365 environments — not a certificate, but proof that you can do the work.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Apply for the Next Cohort
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {outcomes.map((outcome, index) => (
                <OutcomeItem key={index} title={outcome} index={index} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              What applicants usually want to know before joining the simulation.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} {...faq} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
