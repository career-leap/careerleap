import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Calendar, Target } from 'lucide-react';

const OptionCard = ({ icon: Icon, title, description, to, primary = false }) => (
  <motion.div
    className={`rounded-2xl p-6 border transition-all duration-300 h-full ${
      primary 
        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-transparent hover:shadow-lg' 
        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-900/50'
    }`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${primary ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
      <Icon size={24} className={primary ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
    </div>
    <h3 className={`text-xl font-bold mb-2 ${primary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h3>
    <p className={`text-sm leading-relaxed mb-4 ${primary ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>{description}</p>
    <Link 
      to={to} 
      className={`inline-flex items-center gap-1 text-sm font-semibold ${primary ? 'text-white hover:underline' : 'text-indigo-600 dark:text-indigo-400 hover:underline'}`}
    >
      Learn more <ArrowRight size={16} />
    </Link>
  </motion.div>
);

export default function HelpMeChoose() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target size={16} />
              Find Your Path
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              Not Sure Which Track Is Right for You?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              CareerLeap offers multiple paths depending on your goals, experience, and timeline. Book a quick call and we will help you choose the right simulation or support option.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Book an Info Session
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Options Grid */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Explore Your Options
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Here is a quick overview of the paths you can take with CareerLeap.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OptionCard
              icon={Calendar}
              title="Simulation Cohorts"
              description="Hands-on, supervised cohorts where you build real systems and workflows. Best if you want structured, role-aligned experience."
              to="/career-tracks/it-systems-administration"
            />
            <OptionCard
              icon={MessageCircle}
              title="Expert Support"
              description="1-on-1 sessions with mentors for CV reviews, mock interviews, or technical deep dives. Best for targeted, flexible guidance."
              to="/career-tracks/mentor-expert-support"
            />
            <OptionCard
              icon={Target}
              title="Career Acceleration"
              description="Focused coaching on your job search, applications, and interview strategy in the German market."
              to="/career-tracks/career-acceleration-support"
              primary
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Still deciding?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Tell us about your background and goals. We will recommend the right track and let you know when the next cohort opens.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Get Personalised Guidance
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
