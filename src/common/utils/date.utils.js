export const formatDateDDMMYYYY = (dateInput) => {
    if (!dateInput) {
        return '';
    }
    
    const date = new Date(dateInput);

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires'
    };

    if (isNaN(date.getTime())) {
        return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-AR', options);
};