import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { trackAction } from '../lib/metrics';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.post('/auth/contact/', formData);
      if (response.data.success) {
        setStatus({ type: 'success', message: response.data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
        trackAction('contact_form_submit', { subject: formData.subject });
      } else {
        setStatus({ type: 'error', message: response.data.message || 'Failed to send message' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again later.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-4">Get in Touch</h1>
        <p className="text-xl opacity-90">Have questions? We'd love to hear from you.</p>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Let's Start a Conversation</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Whether you're looking for mentorship, want to become a mentor, or have questions about our platform, our team is here to help.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Email Us</h4>
                  <a href="mailto:info@career-leap.academy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    info@career-leap.academy
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-gray-800 rounded-2xl p-8 transition-colors">
            {status.message && (
              <div className={`mb-6 p-4 rounded-lg ${
                status.type === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="How can we help?"
                  required
                />
              </div>
              
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none transition-colors min-h-[150px] resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
