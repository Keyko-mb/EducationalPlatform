import { defineStore } from 'pinia';
import axios from "axios";
import {useStudentStore} from "@/stores/studentInfo.js";

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: '',
    fontSize: '1rem',
    fontFamily: 'Nunito, sans-serif',
    letterSpacing: '0rem',
    lineHeight: '1.5rem',
    imgHidingFlag : false,
    isSerifFlag: false,
    screenReaderEnabled: false,
    screenReaderVoice: '',
    screenReaderRate: 1,
    screenReaderVolume: 1,
  }),
  actions: {
    setTheme(theme, toggle = true) {
      const studentInfo = useStudentStore();
      if (toggle && this.theme === theme) {
        this.theme = '';
        document.documentElement.classList.remove('light', 'dark', 'blue');
      } else {
        this.theme = theme;
        document.documentElement.classList.remove('light', 'dark', 'blue');
        document.documentElement.classList.add(`${theme}`);
      }
      // try {
      //   axios
      //       .put(`people/${studentInfo.studentId}/settings`,
      //           {
      //             theme: theme,
      //             fontSize: this.fontSize,
      //             isSerif: this.fontFamily,
      //             lineHeight: this.lineHeight,
      //             letterSpacing: this.letterSpacing,
      //             imgHiding: this.imgHidingFlag
      //           });
      // } catch (error) {
      //   console.error('Ошибка сохранения размера шрифта', error);
      // }
    },
    setLineHeight(value) {
      const studentInfo = useStudentStore();
      this.lineHeight = value;
      if (value === 'normal') {
        document.documentElement.style.setProperty('--line-height-factor', '1.5');
      } else if (value === 'large') {
        document.documentElement.style.setProperty('--line-height-factor', '1.75');
      } else if (value === 'xlarge') {
        document.documentElement.style.setProperty('--line-height-factor', '2');
      }
      // try {
      //   axios
      //       .put(`people/${studentInfo.studentId}/settings`,
      //           {
      //             theme: this.theme,
      //             fontSize: this.fontSize,
      //             isSerif: this.fontFamily
      //           });
      // } catch (error) {
      //   console.error('Ошибка сохранения размера шрифта', error);
      // }
    },
    setLetterSpacing(value) {
      const studentInfo = useStudentStore();
      this.letterSpacing = value;
      if (value === 'normal') {
        document.documentElement.style.setProperty('--letter-spacing-factor', '0');
      } else if (value === 'large') {
        document.documentElement.style.setProperty('--letter-spacing-factor', '0.1');
      } else if (value === 'xlarge') {
        document.documentElement.style.setProperty('--letter-spacing-factor', '0.2');
      }
      // try {
      //   axios
      //       .put(`people/${studentInfo.studentId}/settings`,
      //           {
      //             theme: this.theme,
      //             fontSize: this.fontSize,
      //             isSerif: this.fontFamily
      //           });
      // } catch (error) {
      //   console.error('Ошибка сохранения размера шрифта', error);
      // }
    },
    setFontSize(size) {
      const studentInfo = useStudentStore();
      this.fontSize = size;
      if (size === 'normal') {
        document.documentElement.style.setProperty('--font-size', '1rem');
      } else if (size === 'large') {
        document.documentElement.style.setProperty('--font-size', '2rem');
      } else if (size === 'xlarge') {
        document.documentElement.style.setProperty('--font-size', '3rem');
      }
      // try {
      //   axios
      //       .put(`people/${studentInfo.studentId}/settings`,
      //           {
      //             theme: this.theme,
      //             fontSize: size,
      //             isSerif: this.fontFamily
      //           });
      // } catch (error) {
      //   console.error('Ошибка сохранения размера шрифта', error);
      // }
    },
    setFontFamily(isSerifFlag) {
      const studentInfo = useStudentStore();
      this.isSerifFlag = isSerifFlag;
      if (isSerifFlag) {
        this.fontFamily = 'serif';
      }
      else {
        this.fontFamily = 'Nunito, sans-serif';
      }
      document.documentElement.style.setProperty('--font-family', this.fontFamily);
      // const isSerif = fontFamily === 'serif';
      // try {
      //   axios
      //       .put(`people/${studentInfo.studentId}/settings`,
      //           {
      //             theme: this.theme,
      //             fontSize: this.fontSize,
      //             isSerif: isSerifFlag
      //           });
      // } catch (error) {
      //   console.error('Ошибка сохранения размера шрифта', error);
      // }
    },
    setImgHiding(value) {
      const studentInfo = useStudentStore();
      this.imgHidingFlag = value;
      document.body.classList.toggle('disable-images', value);
      // try {
      //   axios
      //       .put(`people/${studentInfo.studentId}/settings`,
      //           {
      //             theme: this.theme,
      //             fontSize: this.fontSize,
      //             isSerif: this.fontFamily
      //           });
      // } catch (error) {
      //   console.error('Ошибка сохранения размера шрифта', error);
      // }
    },
    setScreenReaderEnabled(value) {
      this.screenReaderEnabled = value;
    },
    setScreenReaderVoice(voice) {
      this.screenReaderVoice = voice;
    },
    setScreenReaderRate(rate) {
      this.screenReaderRate = rate;
    },
    setScreenReaderVolume(volume) {
      this.screenReaderVolume = volume;
    },
    applyPersistedSettings() {
      if (this.theme) this.setTheme(this.theme, false);
      if (this.fontSize) this.setFontSize(this.fontSize);
      if (this.fontFamily) this.setFontFamily(this.isSerifFlag);
      if (this.letterSpacing) this.setLetterSpacing(this.letterSpacing);
      if (this.lineHeight) this.setLineHeight(this.lineHeight);
      if (this.imgHidingFlag !== undefined) this.setImgHiding(this.imgHidingFlag);
      }
  },
  persist: true
});
