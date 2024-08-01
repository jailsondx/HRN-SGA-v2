function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

function getCurrentTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime;
}

function getFormattedDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}

function getCurrentDateTime() {
    return `${getFormattedDate()} ${getCurrentTime()}`;
}

function formatDateFromMySQL(mysqlDate) {
    const date = new Date(mysqlDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

module.exports = {
    getCurrentDate, // Data Atual em formato AMERICANO
    getCurrentTime, // Hora Atual
    getFormattedDate, // Formata data atual em formato BR
    getCurrentDateTime, // Data e Hora Atual no formato BR
    formatDateFromMySQL // Converte data do MySQL para formato BR
};
