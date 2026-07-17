import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const TRACK_OPTIONS = [
  { 
    label: 'IT Systems Administration', 
    path: '/career-tracks/it-systems-administration',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  },
  { 
    label: 'Data / BI Career Simulation', 
    path: '/career-tracks/data-bi-career-simulation',
    badge: 'Upcoming',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  },
  { 
    label: 'Business / Operations Analyst', 
    path: '/career-tracks/business-operations-analyst',
    badge: 'Upcoming',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  },
  { 
    label: 'Career Acceleration Support', 
    path: '/career-tracks/career-acceleration-support',
    badge: 'Upcoming',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  },
];

export default function CareerTracksDropdown({ mobile = false, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isActive = location.pathname.startsWith('/career-tracks');

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between text-left ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}`}
        >
          <span>Career Tracks</span>
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="pl-4 flex flex-col gap-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {TRACK_OPTIONS.map((track) => (
                <NavLink
                  key={track.path}
                  to={track.path}
                  onClick={() => {
                    setIsOpen(false);
                    onItemClick?.();
                  }}
                  className={({ isActive }) => 
                    `flex items-center justify-between py-1 text-sm ${
                      isActive 
                        ? 'text-teal-600 dark:text-teal-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`
                  }
                >
                  <span>{track.label}</span>
                  {track.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${track.badgeColor}`}>
                      {track.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 font-medium transition-colors ${
          isActive 
            ? 'text-teal-600 dark:text-teal-400' 
            : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
        }`}
      >
        Career Tracks
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 origin-top-left"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {TRACK_OPTIONS.map((track) => (
              <NavLink
                key={track.path}
                to={track.path}
                className={({ isActive }) => 
                  `flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                    isActive 
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <span>{track.label}</span>
                {track.badge && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${track.badgeColor}`}>
                    {track.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
