import { defineStore } from 'pinia';
import axios from "axios";

export const useCurriculaStore = defineStore('curricula', {
    state: () => ({
        curricula: [],
    }),
    actions: {
        async fetchCurricula() {
            try {
                const response = await axios.get('curricula');
                this.curricula = response.data;
            } catch (error) {
                console.error('Ошибка загрузки учебных программ:', error);
            }
        },
        addCurriculum(curriculum) {
            axios
                .post("curricula", curriculum)
                .then(response => this.curricula.push(response.data))
        },
        async deleteCurriculum(curriculum) {
            try {
                await axios.delete("curricula/" + curriculum.id);
                this.curricula = this.curricula.filter(c => c.id !== curriculum.id);
            } catch (error) {
                console.error('Ошибка при удалении учебной программы:', error);
            }
        },
    },
});
