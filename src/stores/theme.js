import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: '',
    fontSize: '1rem',
    fontFamily: 'Nunito, sans-serif',
    letterSpacing: '0rem',
    lineHeight: '1.5rem',
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme;
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue');
      document.documentElement.classList.add(`theme-${theme}`);
    },
    setLineHeight(value) {
      this.lineHeight = value;
      if (value === 'normal') {
        document.documentElement.style.setProperty('--line-height', '1.5rem');
      } else if (value === 'large') {
        document.documentElement.style.setProperty('--line-height', '1.75rem');
      } else if (value === 'xlarge') {
        document.documentElement.style.setProperty('--line-height', '2rem');
      }
    },
    setLetterSpacing(value) {
      this.letterSpacing = value;
      if (value === 'normal') {
        document.documentElement.style.setProperty('--letter-spacing', '0rem');
      } else if (value === 'large') {
        document.documentElement.style.setProperty('--letter-spacing', '0.1rem');
      } else if (value === 'xlarge') {
        document.documentElement.style.setProperty('--letter-spacing', '0.2rem');
      }
    },
    setFontSize(size) {
      this.fontSize = size;
      if (size === 'normal') {
        document.documentElement.style.setProperty('--font-size', '1rem');
      } else if (size === 'large') {
        document.documentElement.style.setProperty('--font-size', '2rem');
      } else if (size === 'xlarge') {
        document.documentElement.style.setProperty('--font-size', '3rem');
      }
    },
    setFontFamily(fontFamily) {
      this.fontFamily = fontFamily;
      document.documentElement.style.setProperty('--font-family', fontFamily);
      localStorage.setItem('fontFamily', fontFamily); 
    },
  },
});
