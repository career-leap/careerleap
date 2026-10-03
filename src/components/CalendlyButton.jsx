import { Calendar } from 'lucide-react';

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL;

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
      'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:-translate-y-0.5',
    outline:
      'text-teal-600 dark:text-teal-400 border-2 border-teal-600 dark:border-teal-400 hover:bg-teal-600 hover:text-white dark:hover:text-white',
    ghost:
      'text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20',
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
