import { defineStore } from 'pinia';
import axios from "axios";

export const useCurriculaStore = defineStore('curricula', {
    state: () => ({
        curricula: [],
        totalPages: 0
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
        async fetchCurriculaPaginated(page = 0, pageSize = 10) {
            try {
                const response = await axios.get("curricula/paginated", {
                    params: {
                        page: page,
                        size: pageSize
                    }
                });
                this.curricula = response.data.content;
                this.totalPages = response.data.totalPages;
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
