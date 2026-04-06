import React from 'react';
import { motion } from 'framer-motion';
import { Target, Check, X, Award, Users, Shield, TrendingUp, Lightbulb } from 'lucide-react';

const CoreValueCard = ({ icon: Icon, title, description, index }) => (
  <motion.div 
    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const WhatWeDeliverItem = ({ title, index }) => (
  <motion.div 
    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center shrink-0">
      <Check size={18} className="text-indigo-600 dark:text-indigo-400" />
    </div>
    <span className="text-slate-700 dark:text-gray-300 font-medium">{title}</span>
  </motion.div>
);

const WhatWeAreNotItem = ({ title, index }) => (
  <motion.div 
    className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl"
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center shrink-0">
      <X size={18} className="text-red-600 dark:text-red-400" />
    </div>
    <span className="text-slate-700 dark:text-gray-300 font-medium line-through decoration-red-400">{title}</span>
  </motion.div>
);

export default function About() {
  const coreValues = [
    {
      icon: Target,
      title: "Execution Excellence",
      description: "Competence is built through structured action and disciplined delivery."
    },
    {
      icon: Shield,
      title: "Accountability",
      description: "Deadlines, documentation, and communication reflect real workplace expectations."
    },
    {
      icon: Lightbulb,
      title: "Realism",
      description: "Simulation environments mirror professional workflows rather than classroom exercises."
    },
    {
      icon: Users,
      title: "Selective Quality",
      description: "Small cohorts ensure supervision quality, meaningful feedback, and measurable outcomes."
    },
    {
      icon: Award,
      title: "Integrity",
      description: "We operate without inflated promises or artificial guarantees, prioritising sustainable competence development."
    }
  ];

  const deliverables = [
    "Structured task ownership",
    "Documentation discipline",
    "Professional communication clarity",
    "Interview-defendable narratives based on real deliverables"
  ];

  const notDeliverables = [
    "A short-term bootcamp",
    "A certificate-driven program",
    "A job guarantee service",
    "A placement agency"
  ];

  return (
    <div>
      {/* Hero Section - Why CareerLeap Exists */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
              Why CareerLeap Exists
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                International students often complete rigorous academic programs yet enter recruitment processes without structured exposure to professional workflows.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                This creates a transition gap between graduation and workplace expectations.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-xl font-medium leading-relaxed">
                CareerLeap was established to close this gap through disciplined career simulation—where execution is practised, reviewed, and documented to professional standards.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Deliver vs What We Are Not */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* What We Deliver */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6" />
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">What We Do</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                CareerLeap builds controlled simulation environments that replicate workplace expectations.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold mb-4">
                Participants develop:
              </p>
              <div className="space-y-3">
                {deliverables.map((item, index) => (
                  <WhatWeDeliverItem key={index} title={item} index={index} />
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-500 mt-6 italic">
                The focus is measurable competence development—not theoretical knowledge transfer.
              </p>
            </motion.div>

            {/* What We Are Not */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-12 h-1 bg-red-500 rounded-full mb-6" />
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">What We Don't</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                CareerLeap doesn't:
              </p>
              <div className="space-y-3 mb-6">
                {notDeliverables.map((item, index) => (
                  <WhatWeAreNotItem key={index} title={item} index={index} />
                ))}
              </div>
              <p className="text-slate-900 dark:text-white font-semibold">
                We operate as a structured professional readiness platform instead.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <Target size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To strengthen the transition from academic education to professional employment through disciplined execution practice.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">Vision</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To become Germany's leading structured career simulation platform and a trusted partner to universities and employers supporting international talent integration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

{/* Core Values */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award size={16} />
              Core Values
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              The Principles That Guide Us
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <CoreValueCard 
                key={index} 
                icon={value.icon} 
                title={value.title} 
                description={value.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
