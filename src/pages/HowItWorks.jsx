import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Target, 
  Award, 
  CheckCircle2,
  ArrowRight,
  Calendar,
  Briefcase,
  ClipboardCheck,
  MessageSquare
} from 'lucide-react';
import CalendlyButton from '../components/CalendlyButton';

const SIMULATION_STEPS = [
  {
    step: '01',
    icon: Users,
    title: 'Join as a Junior Team Member',
    description:
      'You are placed in a team that mirrors a real department — IT, Data, or Marketing. You report to an industry professional who assigns real tasks, reviews your work, and gives feedback.',
  },
  {
    step: '02',
    icon: Briefcase,
    title: 'Work on Real Company Tasks',
    description:
      'For 3–4 months you contribute to projects, attend team standups, document your work, and deliver outputs that go into a professional portfolio.',
  },
  {
    step: '03',
    icon: Target,
    title: 'Get Career Coaching',
    description:
      'Receive CV reviews, LinkedIn optimization, interview coaching, and job-search strategy tailored to how hiring actually works in Germany.',
  },
  {
    step: '04',
    icon: Award,
    title: 'Apply with Confidence',
    description:
      'Leave with hands-on experience, references from team leads, and a clear narrative that German employers can understand and trust.',
  },
];

const WHAT_YOU_DO = [
  {
    icon: Calendar,
    title: 'Weekly team standups',
    description: 'Report progress, blockers, and next steps just like a real team member.',
  },
  {
    icon: ClipboardCheck,
    title: 'Real deliverables',
    description: 'Complete tickets, build dashboards, document processes, or configure systems.',
  },
  {
    icon: MessageSquare,
    title: 'Professional communication',
    description: 'Practise asking questions, giving updates, and presenting work to stakeholders.',
  },
  {
    icon: Building2,
    title: 'Company context',
    description: 'Make decisions within realistic constraints: deadlines, priorities, and team dependencies.',
  },
];

const COMPARISON = [
  { label: 'Classroom course', simulation: 'You observe', course: 'You listen', bootcamp: 'You practise' },
  { label: 'Bootcamp', simulation: 'You do the job', course: 'No deliverables', bootcamp: 'Guided exercises' },
  { label: 'CareerLeap simulation', simulation: 'You own outcomes', course: 'Certificate', bootcamp: 'Portfolio' },
];

export default function HowItWorks() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 size={16} />
              How the Simulation Works
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Not a course.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
                A real company experience.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
              CareerLeap places you inside a simulated company for 3–4 months. You work as a junior team member, report to an industry professional, and build the experience German employers actually want.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
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
          </motion.div>
        </div>
      </section>

      {/* The 4 Steps */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Your Journey Through the Simulation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Four phases that take you from observer to employable practitioner.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SIMULATION_STEPS.map((item, index) => (
              <motion.div
                key={item.step}
                className="bg-slate-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6">
                  <item.icon size={24} />
                </div>
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

      {/* What You Actually Do */}
      <section className="py-20 px-4 bg-amber-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-6" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                What You Actually Do Day to Day
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                You do not watch videos and take quizzes. You show up, get assigned work, and deliver. Your team lead reviews your output the same way a manager would in a real company.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0" />
                  Attend team standups and sprint check-ins
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0" />
                  Pick up tasks from a real backlog or ticket queue
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0" />
                  Document your decisions and deliverables
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-teal-500 shrink-0" />
                  Present your work and receive structured feedback
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {WHAT_YOU_DO.map((item, index) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4">
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Simulation vs. Course vs. Bootcamp
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We are not competing with education providers. We complement them with structured execution experience.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 bg-slate-50 dark:bg-gray-800 p-4 font-semibold text-sm text-slate-900 dark:text-white">
              <span>What you get</span>
              <span className="text-teal-600 dark:text-teal-400">CareerLeap</span>
              <span>Course</span>
              <span>Bootcamp</span>
            </div>
            {[
              ['Experience type', 'Real team role', 'Theoretical lessons', 'Guided exercises'],
              ['Accountability', 'Team lead + deadlines', 'Self-paced', 'Instructor-led'],
              ['Output', 'Portfolio + references', 'Certificate', 'Projects'],
              ['Job readiness', 'Interview-defendable', 'Knowledge-based', 'Skill-based'],
            ].map((row, index) => (
              <div
                key={row[0]}
                className={`grid grid-cols-4 p-4 text-sm items-center ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-slate-50 dark:bg-gray-800/50'
                }`}
              >
                <span className="font-medium text-slate-900 dark:text-white">{row[0]}</span>
                <span className="text-teal-600 dark:text-teal-400 font-medium">{row[1]}</span>
                <span className="text-gray-600 dark:text-gray-400">{row[2]}</span>
                <span className="text-gray-600 dark:text-gray-400">{row[3]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Ready to work inside a simulated company?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Apply for the next cohort or book a free info session to ask questions about the simulation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}
