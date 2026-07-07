import { Calendar } from 'lucide-react';

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;

/**
 * Reusable button that opens the Calendly info-session scheduling page.
 * Falls back to the contact page if no Calendly URL is configured.
 */
export default function CalendlyButton({
  children = 'Book a Free Info Session',
  variant = 'outline',
  className = '',
  showIcon = true,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all';

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5',
    outline:
      'text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:text-white',
    ghost:
      'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
  };

  if (!CALENDLY_URL) {
    return null;
  }

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {showIcon && <Calendar size={20} />}
      {children}
    </a>
  );
}
