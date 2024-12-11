export function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
}