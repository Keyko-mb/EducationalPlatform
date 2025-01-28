import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: '',
    fontSize: '1rem',
    fontFamily: 'Nunito, sans-serif',
    letterSpacing: '0rem',
    lineHeight: '1.5rem',
    imgHidingFlag : false
  }),
  actions: {
    setTheme(theme) {
      if (this.theme === theme) {
        this.theme = '';
        document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue');
      } else {
        this.theme = theme;
        document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue');
        document.documentElement.classList.add(`theme-${theme}`);
      }
    },
    setLineHeight(value) {
      this.lineHeight = value;
      if (value === 'normal') {
        document.documentElement.style.setProperty('--line-height-factor', '1.5');
      } else if (value === 'large') {
        document.documentElement.style.setProperty('--line-height-factor', '1.75');
      } else if (value === 'xlarge') {
        document.documentElement.style.setProperty('--line-height-factor', '2');
      }
    },
    setLetterSpacing(value) {
      this.letterSpacing = value;
      if (value === 'normal') {
        document.documentElement.style.setProperty('--letter-spacing-factor', '0');
      } else if (value === 'large') {
        document.documentElement.style.setProperty('--letter-spacing-factor', '0.1');
      } else if (value === 'xlarge') {
        document.documentElement.style.setProperty('--letter-spacing-factor', '0.2');
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
    setImgHiding(value) {
      this.imgHidingFlag = value;
      document.body.classList.toggle('disable-images', value);
    }
  },
});
