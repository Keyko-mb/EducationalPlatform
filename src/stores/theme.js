import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: '',
    fontSize: '1rem',
    fontFamily: 'Nunito, sans-serif',
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme;
      document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue');
      document.documentElement.classList.add(`theme-${theme}`);
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
