import { defineStore } from 'pinia';
import axios from "axios";

export const useCurriculaStore = defineStore('curricula', {
    state: () => ({
        curricula: [],
    }),
    actions: {
        fetchCurricula() {
            axios.get('curricula').then((response) => {
                this.curricula = response.data
            })
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
