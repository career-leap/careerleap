import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for exploring mentorship',
    features: ['Browse all mentors', '1 free intro session', 'Community access', 'Basic profile', 'Email support'],
    featured: false,
    buttonText: 'Contact Us',
    buttonStyle: 'outline'
  },
  {
    name: 'Professional',
    monthlyPrice: 49,
    yearlyPrice: 470,
    description: 'Best for active career growth',
    features: ['Unlimited mentor sessions', 'Priority booking', 'Goal tracking tools', 'Resource library access', 'Priority support', 'Session recordings'],
    featured: true,
    buttonText: 'Start Free Trial',
    buttonStyle: 'primary'
  },
  {
    name: 'Enterprise',
    monthlyPrice: 199,
    yearlyPrice: 1910,
    description: 'For teams and organizations',
    features: ['Everything in Professional', 'Team management dashboard', 'Custom onboarding', 'Dedicated account manager', 'Analytics & reporting', 'SSO integration'],
    featured: false,
    buttonText: 'Contact Sales',
    buttonStyle: 'outline'
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div>
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 text-center transition-colors">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Choose the plan that fits your career goals</p>
        
        <div className="flex items-center justify-center gap-4">
          <span className={`font-medium transition-colors ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className={`w-16 h-8 rounded-full relative transition-colors ${isAnnual ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${isAnnual ? 'left-9' : 'left-1'}`} />
          </button>
          <span className={`font-medium transition-colors ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Annual <span className="text-indigo-600 dark:text-indigo-400 font-bold">(Save 20%)</span>
          </span>
        </div>
      </section>

      <section className="py-12 px-4 pb-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-900/50 transition-all hover:-translate-y-2 border border-gray-100 dark:border-gray-700 ${plan.featured ? 'border-2 border-indigo-600 dark:border-indigo-500 scale-105' : ''}`}
            >
              {plan.featured && (
                <div className="inline-block px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-4 -mt-12">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                ${isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                <span className="text-base font-normal text-gray-500 dark:text-gray-400">/{isAnnual ? 'year' : 'month'}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check size={20} className="text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/contact"
                className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${
                  plan.buttonStyle === 'primary' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg' 
                    : 'border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
