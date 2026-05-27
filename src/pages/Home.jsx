import React from 'react';
import { Users, BookOpen, MessageSquare, Target, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-8 bg-slate-50 dark:bg-gray-800 rounded-2xl hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300">
    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const Step = ({ number, title, description }) => (
  <div className="text-center relative">
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Practice the Role. Prove You're Ready.
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-lg">
              CareerLeap is a structured career simulation platform that prepares international students and graduates in Germany for professional environments.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-lg">
              We bridge the gap between academic education and workplace execution through supervised, role-aligned simulation cohorts.
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              Professional readiness—built through structured simulation.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/contact" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Apply for the Next Cohort
              </Link>
              <Link to="/contact" className="px-8 py-4 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all">
                Book an Info Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Transition Gap Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column - Animates from Left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.h2 
                className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                The Transition Gap
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-400 mb-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Many international graduates complete demanding academic programs in Germany.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Yet hiring decisions are rarely based on academic performance alone.
              </motion.p>
            </motion.div>

            {/* Right Column - Animates from Right */}
            <motion.div 
              className="bg-slate-50 dark:bg-gray-800 rounded-2xl p-8"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <motion.p 
                className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Employers assess:
              </motion.p>
              <ul className="space-y-4">
                {[
                  'Task ownership',
                  'Structured problem-solving',
                  'Professional documentation',
                  'Clear communication',
                  'Ability to explain impact'
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-4 text-slate-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.6 + (index * 0.1), type: "spring", stiffness: 200 }}
                    >
                      {index + 1}
                    </motion.div>
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Text - Fades in from bottom */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              These competencies are often expected—but not systematically practised before employment.
            </motion.p>
            <motion.p 
              className="text-lg text-slate-900 dark:text-white font-semibold mt-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              CareerLeap addresses this transition gap through controlled, execution-focused simulation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The CareerLeap Model Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-6" />
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">The CareerLeap Model</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              CareerLeap operates through selective, cohort-based simulations designed to mirror professional expectations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Defined responsibilities', desc: 'Aligned with target roles' },
              { title: 'Realistic task assignments', desc: 'Hands-on professional scenarios' },
              { title: 'Structured documentation standards', desc: 'Industry-compliant deliverables' },
              { title: 'Review and feedback cycles', desc: 'Continuous improvement loops' },
              { title: 'Interview preparation', desc: 'Based on real deliverables' }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <p className="text-xl md:text-2xl font-bold mb-4">The outcome is not a certificate.</p>
            <p className="text-xl md:text-2xl font-bold mb-6">The outcome is documented, interview-defendable professional readiness.</p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-2xl font-extrabold">10</span>
              <span className="text-white/90">participants per cohort for high-quality supervision</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Why CareerLeap?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to accelerate your career growth, all in one platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Users} title="1-on-1 Mentorship" description="Get personalized guidance from industry experts who understand your career path." />
            <FeatureCard icon={BookOpen} title="Structured Learning" description="Access curated courses and learning paths designed by mentors." />
            <FeatureCard icon={MessageSquare} title="Real-time Feedback" description="Receive constructive feedback on your work and interview preparation." />
            <FeatureCard icon={Target} title="Goal Tracking" description="Set career goals and track your progress with your mentor." />
            <FeatureCard icon={Globe} title="Global Network" description="Connect with mentors and peers from around the world." />
            <FeatureCard icon={Zap} title="Flexible Scheduling" description="Book sessions that fit your schedule. Video calls, chat, or async." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Join the career simulation platform</p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            
            <Step number="1" title="Apply" description="" />
            <Step number="2" title="Selection" description="" />
            <Step number="3" title="Join Cohort" description="" />
            <Step number="4" title="Simulation Work" description="" />
            <Step number="5" title="Interview Readiness" description="" />


                        
          </div>
        </div>
      </section>

      {/* Designed for International Talent Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-6" />
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Designed for International Talent in Germany</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">CareerLeap is structured for:</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'International students', desc: 'Preparing for the German job market' },
              { title: 'Recent graduates', desc: 'Transitioning into professional roles' },
              { title: 'Career changers', desc: 'Seeking structured competence development' }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="bg-slate-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <p className="text-center text-gray-500 dark:text-gray-500 italic">
            It is not designed for passive learning or shortcut expectations.
          </p>
        </div>
      </section>

      {/* Institutional Alignment Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6" />
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Institutional Alignment</h2>
            
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                CareerLeap complements university education and supports early-career integration.
              </p>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
                <p className="text-slate-900 dark:text-white font-semibold mb-2">Our long-term objective</p>
                <p className="text-gray-600 dark:text-gray-400">
                  To collaborate with universities and employers seeking structured transition pathways for international talent.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Take the Next Step - CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        
        <motion.div 
          className="max-w-3xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">Take the Next Step</h2>
          <p className="text-xl text-white/90 mb-4">Move from academic preparation to professional execution.</p>
          <p className="text-lg text-white/80 mb-8">Applications for the upcoming cohort are now open.</p>
          <Link to="/contact" className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Apply for the Next Cohort
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
