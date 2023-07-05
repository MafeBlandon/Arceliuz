const moment = require('moment');

function calcularDateUtc(fechaOriginal) {
    const formatoOriginal = 'DD/MM/YYYY - hh:mm:ss a'; // Formato de la fecha original
    const fechaUtc = moment(fechaOriginal, formatoOriginal).toDate(); // Convierte a UTC
    return fechaUtc
}

module.exports = {
    calcularDateUtc, // Imprime la fecha en formato UTC
}