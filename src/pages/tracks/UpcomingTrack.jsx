import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import SchemaScript from '../../components/SchemaScript';

export default function UpcomingTrack({ 
  title, 
  subtitle,
  description, 
  expectedSkills = [],
  cohortSize = '10',
  duration = '3–6 months',
  launchWindow = 'Coming soon',
  seoTitle,
  seoDescription,
  schema,
}) {
  return (
    <div>
      <Helmet>
        <title>{seoTitle || title}</title>
        {seoDescription && (
          <meta name="description" content={seoDescription} />
        )}
      </Helmet>
      {schema && <SchemaScript schema={schema} />}
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
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Calendar size={16} />
              Upcoming Cohort
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-teal-600 dark:text-teal-400 font-semibold mb-4">
                {subtitle}
              </p>
            )}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {description}
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Join the Waitlist
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Track Overview */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, label: 'Cohort Size', value: `${cohortSize} Participants` },
              { icon: Clock, label: 'Duration', value: duration },
              { icon: Calendar, label: 'Launch Window', value: launchWindow },
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
        </div>
      </section>

      {/* Expected Skills / Modules */}
      {expectedSkills.length > 0 && (
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
                What You Will Practise
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Planned focus areas for this simulation track.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expectedSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{skill.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Be the first to know when this track opens
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Spots are limited to keep cohorts small and supervision high-quality. Join the waitlist and we will contact you with early access details.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Join the Waitlist
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
