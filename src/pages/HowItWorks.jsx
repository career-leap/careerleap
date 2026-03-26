import React from 'react';
import { Calendar, Target, Video, BookOpen, Star, Shield, Check } from 'lucide-react';

const Step = ({ number, title, description }) => (
  <div className="text-center relative">
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-8 bg-slate-50 dark:bg-gray-800 rounded-2xl hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300">
    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default function HowItWorks() {
  return (
    <div>
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 text-center transition-colors">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4">How CareerLeap Works</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Your journey to career success in four simple steps</p>
      </section>

      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <Step 
              number="1" 
              title="Create Your Profile" 
              description="Sign up and tell us about your career goals, current role, and what you're looking to achieve." 
            />
            <Step 
              number="2" 
              title="Find Your Mentor" 
              description="Browse our curated list of mentors, filter by industry, expertise, and availability." 
            />
            <Step 
              number="3" 
              title="Book a Session" 
              description="Choose a time that works for you. Sessions can be video calls, voice calls, or async messaging." 
            />
            <Step 
              number="4" 
              title="Grow Together" 
              description="Receive personalized guidance, set actionable goals, and track your progress." 
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Everything you need for a successful mentorship experience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Calendar} title="Smart Scheduling" description="Calendar integration with automatic timezone handling for global mentorship." />
            <FeatureCard icon={Target} title="Goal Setting" description="Set and track career goals with your mentor's guidance and accountability." />
            <FeatureCard icon={Video} title="Video Calls" description="HD video conferencing built right into the platform. No external apps needed." />
            <FeatureCard icon={BookOpen} title="Resources Library" description="Access templates, guides, and resources shared by your mentor." />
            <FeatureCard icon={Star} title="Feedback System" description="Continuous improvement through structured feedback after each session." />
            <FeatureCard icon={Shield} title="Secure & Private" description="End-to-end encryption for all communications and data protection." />
          </div>
        </div>
      </section>
    </div>
  );
}
