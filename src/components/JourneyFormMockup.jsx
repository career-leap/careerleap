import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalendlyButton from './CalendlyButton';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  Rocket,
  ShieldCheck,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Target,
  GraduationCap,
  Users,
  Building2,
  HelpCircle,
  Linkedin,
  Send
} from 'lucide-react';
import api from '../lib/api';
import { trackAction } from '../lib/metrics';

/* ──────────────── Field Config ──────────────── */
const LOCATION_OPTIONS = ['Germany', 'Other EU country', 'Outside Europe'];

const CAREER_STAGE_OPTIONS = [
  'International student in Germany',
  'Recent graduate',
  'Career changer',
  'Job seeker',
  'Working professional looking to transition',
  'University / organization representative',
  'Interested mentor',
  'Other'
];

const GOAL_OPTIONS = [
  'Join a CareerLeap simulation cohort',
  'Build a job-ready portfolio',
  'Improve my CV and LinkedIn',
  'Prepare for interviews',
  'Get mentorship or career guidance',
  'Understand the German job market',
  'Become a mentor',
  'Partner with CareerLeap',
  'Get more information'
];

const TRACK_OPTIONS = [
  'IT Systems Administration Simulation',
  'Data / BI Career Simulation',
  'Business / Operations Analyst Track',
  'Career Acceleration Support',
  'Not sure yet — help me choose',
  'Mentor / Expert Support',
  'Partnership / Institutional Collaboration'
];

const PRIORITY_OPTIONS = [
  'Get my first job in Germany',
  'Change into a new career path',
  'Build practical experience',
  'Improve my applications',
  'Prepare for interviews',
  'Build a stronger portfolio',
  'Find mentorship and guidance',
  'Explore partnership with CareerLeap',
  'Other'
];

const TIMELINE_OPTIONS = [
  'Immediately',
  'Within the next 2 weeks',
  'Within 1 month',
  'Later / just exploring'
];

const INFO_CALL_OPTIONS = ['Yes', 'No', 'Maybe'];

const CONTACT_METHOD_OPTIONS = ['Email', 'WhatsApp', 'LinkedIn', 'Phone call'];

const SOURCE_OPTIONS = [
  'LinkedIn',
  'Instagram',
  'TikTok',
  'WhatsApp',
  'Friend / referral',
  'University / school',
  'Career event',
  'Google search',
  'Other'
];

const SECTIONS = [
  { id: 'about', label: 'About You', icon: User },
  { id: 'situation', label: 'Your Career Situation', icon: Briefcase },
  { id: 'next', label: 'Next Step', icon: Rocket }
];

/* ──────────────── Component ──────────────── */
export default function JourneyFormMockup() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    career_stage: '',
    current_goal: [],
    track_interest: '',
    career_priority: '',
    start_timeline: '',
    info_call_availability: '',
    preferred_contact_method: '',
    source_channel: '',
    message: '',
    gdpr_consent: false,
    marketing_consent: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [utmParams, setUtmParams] = useState({});

  /* Capture UTM params on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || ''
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      current_goal: prev.current_goal.includes(goal)
        ? prev.current_goal.filter(g => g !== goal)
        : [...prev.current_goal, goal]
    }));
    if (errors.current_goal) setErrors(prev => ({ ...prev, current_goal: '' }));
  };

  const validateSection = (sectionIndex) => {
    const newErrors = {};
    if (sectionIndex === 0) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.location) newErrors.location = 'Location is required';
    }
    if (sectionIndex === 1) {
      if (!formData.career_stage) newErrors.career_stage = 'Career stage is required';
      if (formData.current_goal.length === 0) newErrors.current_goal = 'Select at least one goal';
      if (!formData.track_interest) newErrors.track_interest = 'Track interest is required';
      if (!formData.career_priority) newErrors.career_priority = 'Career priority is required';
    }
    if (sectionIndex === 2) {
      if (!formData.start_timeline) newErrors.start_timeline = 'Start timeline is required';
      if (!formData.info_call_availability) newErrors.info_call_availability = 'Please select an option';
      if (!formData.preferred_contact_method) newErrors.preferred_contact_method = 'Preferred contact method is required';
      if (!formData.gdpr_consent) newErrors.gdpr_consent = 'You must agree to continue';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, SECTIONS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSection(currentSection)) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    const payload = {
      ...formData,
      email: formData.email.toLowerCase(),
      source_page: 'CareerLeap Landing Page',
      ...utmParams
    };

    try {
      const response = await api.post('/leads/journey/', payload);
      if (response.data.success) {
        setSubmitted(true);
        trackAction('journey_form_submit', {
          lead_type: response.data.lead_type,
          lead_score: response.data.lead_score
        });
      } else {
        setStatus({ type: 'error', message: response.data.message || 'Submission failed' });
      }
    } catch (error) {
      const msg = error.response?.data?.message
        || 'Something went wrong. Please try again. If the issue continues, contact us directly at info@career-leap.academy.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────── Thank You Screen ──────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Thank you for starting your CareerLeap journey.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We&apos;ve received your submission and will review your information carefully. Our team will contact you soon with the best next step based on your goals.
          </p>
          <div className="mb-6">
            <CalendlyButton variant="primary">
              Or book a free info session now
            </CalendlyButton>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            For urgent questions, you can also reach us at{' '}
            <a href="mailto:info@career-leap.academy" className="text-teal-600 dark:text-teal-400 hover:underline">
              info@career-leap.academy
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  /* ──────────────── Form Render ──────────────── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Start Your CareerLeap Journey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Tell us where you are in your career journey, and we&apos;ll guide you to the right simulation track, mentorship support, info session, or partnership conversation.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {SECTIONS.map((section, index) => {
              const Icon = section.icon;
              const isActive = index === currentSection;
              const isCompleted = index < currentSection;
              return (
                <div key={section.id} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-900/40'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-xs font-medium mt-2 hidden sm:block ${
                    isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {section.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-teal-600 rounded-full"
              initial={false}
              animate={{ width: `${((currentSection + 1) / SECTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10"
        >
          {status.message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              status.type === 'error'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            }`}>
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="text-sm">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* ═══════════ SECTION 1: ABOUT YOU ═══════════ */}
              {currentSection === 0 && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User size={22} className="text-teal-600 dark:text-teal-400" />
                    About You
                  </h2>

                  {/* Full Name */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={e => handleChange('full_name', e.target.value)}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 ${
                        errors.full_name ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                      }`}
                    />
                    {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => handleChange('email', e.target.value)}
                        placeholder="yourname@email.com"
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 ${
                          errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Phone / WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        placeholder="Optional, but recommended for faster follow-up"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-600 dark:focus:border-teal-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.location}
                        onChange={e => handleChange('location', e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
                          errors.location ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      >
                        <option value="">Select your location</option>
                        {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </motion.div>
              )}

              {/* ═══════════ SECTION 2: YOUR CAREER SITUATION ═══════════ */}
              {currentSection === 1 && (
                <motion.div
                  key="situation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase size={22} className="text-teal-600 dark:text-teal-400" />
                    Your Career Situation
                  </h2>

                  {/* Career Stage */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Which best describes you? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.career_stage}
                        onChange={e => handleChange('career_stage', e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
                          errors.career_stage ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      >
                        <option value="">Select your career stage</option>
                        {CAREER_STAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {errors.career_stage && <p className="text-red-500 text-sm mt-1">{errors.career_stage}</p>}
                  </div>

                  {/* Current Goal (Checkbox Group) */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-3">
                      What are you looking for right now? <span className="text-red-500">*</span>
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">(Select all that apply)</span>
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {GOAL_OPTIONS.map(goal => (
                        <label
                          key={goal}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.current_goal.includes(goal)
                              ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.current_goal.includes(goal)}
                            onChange={() => toggleGoal(goal)}
                            className="mt-0.5 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                        </label>
                      ))}
                    </div>
                    {errors.current_goal && <p className="text-red-500 text-sm mt-2">{errors.current_goal}</p>}
                  </div>

                  {/* Track Interest */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Which CareerLeap path are you most interested in? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.track_interest}
                        onChange={e => handleChange('track_interest', e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
                          errors.track_interest ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      >
                        <option value="">Select a track</option>
                        {TRACK_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {errors.track_interest && <p className="text-red-500 text-sm mt-1">{errors.track_interest}</p>}
                  </div>

                  {/* Career Priority */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      What is your current career priority? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Rocket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.career_priority}
                        onChange={e => handleChange('career_priority', e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
                          errors.career_priority ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      >
                        <option value="">Select your priority</option>
                        {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {errors.career_priority && <p className="text-red-500 text-sm mt-1">{errors.career_priority}</p>}
                  </div>
                </motion.div>
              )}

              {/* ═══════════ SECTION 3: NEXT STEP ═══════════ */}
              {currentSection === 2 && (
                <motion.div
                  key="next"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Rocket size={22} className="text-teal-600 dark:text-teal-400" />
                    Next Step
                  </h2>

                  {/* Start Timeline */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      When would you like to start? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.start_timeline}
                        onChange={e => handleChange('start_timeline', e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
                          errors.start_timeline ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      >
                        <option value="">Select timeline</option>
                        {TIMELINE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {errors.start_timeline && <p className="text-red-500 text-sm mt-1">{errors.start_timeline}</p>}
                  </div>

                  {/* Info Call Availability (Radio) */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-3">
                      Are you available for a short info call? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {INFO_CALL_OPTIONS.map(opt => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.info_call_availability === opt
                              ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                              : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="info_call"
                            value={opt}
                            checked={formData.info_call_availability === opt}
                            onChange={e => handleChange('info_call_availability', e.target.value)}
                            className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                          />
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.info_call_availability && <p className="text-red-500 text-sm mt-2">{errors.info_call_availability}</p>}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Preferred Contact Method <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.preferred_contact_method}
                        onChange={e => handleChange('preferred_contact_method', e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
                          errors.preferred_contact_method ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-500'
                        }`}
                      >
                        <option value="">Select contact method</option>
                        {CONTACT_METHOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    {errors.preferred_contact_method && <p className="text-red-500 text-sm mt-1">{errors.preferred_contact_method}</p>}
                  </div>

                  {/* Source Channel */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      How did you hear about CareerLeap?
                    </label>
                    <div className="relative">
                      <HelpCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.source_channel}
                        onChange={e => handleChange('source_channel', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-600 dark:focus:border-teal-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                      >
                        <option value="">Select source (optional)</option>
                        {SOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                      Tell us briefly about your career goal or challenge
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => handleChange('message', e.target.value)}
                      placeholder="Example: I recently graduated and want to enter IT support, data analytics, or business analysis in Germany, but I need practical experience, portfolio projects, and guidance."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-600 dark:focus:border-teal-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-y"
                    />
                  </div>

                  {/* GDPR Consent */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.gdpr_consent}
                        onChange={e => handleChange('gdpr_consent', e.target.checked)}
                        className={`mt-0.5 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 ${errors.gdpr_consent ? 'border-red-500' : ''}`}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        I agree that CareerLeap Academy may contact me regarding my inquiry and process my data according to the{' '}
                        <a href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                          Privacy Policy
                        </a>.
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    {errors.gdpr_consent && <p className="text-red-500 text-sm mt-2">{errors.gdpr_consent}</p>}
                  </div>

                  {/* Marketing Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.marketing_consent}
                        onChange={e => handleChange('marketing_consent', e.target.checked)}
                        className="mt-0.5 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        I would like to receive occasional updates about CareerLeap cohorts, events, and career resources.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentSection === 0}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-0"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              {currentSection < SECTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Start My CareerLeap Journey
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ShieldCheck size={16} />
            Your data is secure and will never be shared with third parties.
          </div>
        </div>
      </div>
    </div>
  );
}
