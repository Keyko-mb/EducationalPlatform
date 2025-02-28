import { defineStore } from 'pinia';
import axios from "axios";
import {useStudentStore} from "@/stores/studentInfo.js";

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'default',
    fontSize: 'normal',
    fontFamily: 'Nunito, sans-serif',
    letterSpacing: 'normal',
    lineHeight: 'normal',
    imgHidingFlag : false,
    isSerifFlag: false,
    screenReaderEnabled: false,
    screenReaderVoice: '',
    screenReaderRate: 1,
    screenReaderVolume: 1,
  }),
  actions: {
    editTheme() {
      const studentInfo = useStudentStore();
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!studentInfo.studentId || !userInfo) {
        console.log('Нет ID студента, запрос не отправлен');
        return;
      }

      axios.put(`people/${studentInfo.studentId}/settings`, {
        theme: this.theme,
        fontSize: this.fontSize,
        isSerif: this.isSerifFlag,
        lineHeight: this.lineHeight,
        letterSpacing: this.letterSpacing,
        imgHiding: this.imgHidingFlag
      }).catch(error => {
        console.error('Ошибка сохранения настроек', error);
      });
    },
    setTheme(theme, toggle = true) {
      if (toggle && this.theme === theme) {
        this.theme = 'default';
        document.documentElement.classList.remove('light', 'dark', 'blue');
      } else {
        this.theme = theme;
        document.documentElement.classList.remove('light', 'dark', 'blue');
        document.documentElement.classList.add(`${theme}`);
      }
      this.editTheme();
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
      this.editTheme();
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
      this.editTheme();
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
      this.editTheme();
    },
    setFontFamily(isSerifFlag) {
      this.isSerifFlag = isSerifFlag;
      if (isSerifFlag) {
        this.fontFamily = 'serif';
      }
      else {
        this.fontFamily = 'Nunito, sans-serif';
      }
      document.documentElement.style.setProperty('--font-family', this.fontFamily);
      this.editTheme();
    },
    setImgHiding(value) {
      this.imgHidingFlag = value;
      document.body.classList.toggle('disable-images', value);
      this.editTheme();
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
