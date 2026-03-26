import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light', 'dark', 'system'
      
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        get().applyTheme(newTheme);
      },
      
      applyTheme: (theme) => {
        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (theme === 'system' && systemDark)) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      
      initTheme: () => {
        const { theme, applyTheme } = get();
        applyTheme(theme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
          if (get().theme === 'system') {
            applyTheme('system');
          }
        });
      }
    }),
    {
      name: 'careerleap-theme',
    }
  )
);
