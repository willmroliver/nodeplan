// Converts HTML DateTime Outputs into JavaScript Date() objects
const getDateObject = (dateTimeHTML) => {
    return new Date(dateTimeHTML);
}
module.exports.getDateObject = getDateObject;

// Returns a time string of format HH:MM for user display info
const getTimeString = (dateTimeHTML) => {
    return dateTimeHTML.split('T')[1].substring(0, 5);
}
module.exports.getTimeString = getTimeString

// Returns a DateTimeObject formatted for DB storage
const getDateTimeSaveInfo = (dateTimeHTML) => {
    const dateObject = getDateObject(dateTimeHTML);
    const timeString = getTimeString(dateTimeHTML);
    return {
        time: timeString,
        day: getDayString(dateObject.getDay()),
        date: dateObject.getDate(),
        month: dateObject.getMonth(),
        year: dateObject.getFullYear()
    }
}
module.exports.getDateTimeSaveInfo = getDateTimeSaveInfo

// For route parameters
const getMonthString = (monthNumber) => {

    switch (monthNumber) {
        case 0:
            return 'january';
        case 1:
            return 'february';
        case 2:
            return 'march';
        case 3:
            return 'april';
        case 4:
            return 'may';
        case 5:
            return 'june';
        case 6:
            return 'july';
        case 7:
            return 'august';
        case 8:
            return 'september';
        case 9:
            return 'october';
        case 10:
            return 'november';
        case 11:
            return 'december';
    }
}
module.exports.getMonthString = getMonthString;

// Converts month string back to number (0-11) post-routing;
const getMonthNumber = (monthString) => {

    switch (monthString) {
        case 'january':
            return 0;
        case 'february':
            return 1;
        case 'march':
            return 2;
        case 'april':
            return 3;
        case 'may':
            return 4;
        case 'june':
            return 5;
        case 'july':
            return 6;
        case 'august':
            return 7;
        case 'september':
            return 8;
        case 'october':
            return 9;
        case 'november':
            return 10;
        case 'december':
            return 11;
    }
}  
module.exports.getMonthNumber = getMonthNumber;

// 0-6 >> Mon - Sun
const getDayString = (dayNumber) => {
    var day = "";
    switch (dayNumber) {
        case 0:
            day = 'Sunday';
            break;
        case 1:
            day = 'Monday';
            break;
        case 2:
            day = 'Tuesday'; 
            break;
        case 3:
            day = 'Wednesday';
            break;
        case 4:
            day = 'Thursday';
            break;
        case 5:
            day = 'Friday';
            break;
        case 6:
            day = 'Saturday'
            break;
        default:
            day = 'Sunday';
    }
    return day;
}
module.exports.getDayString = getDayString;

// Gets starting index for event-placement in calendar cells (see CALENDAR.JS - const startingIndex)
const getStartingIndex = (year, month) => {
    
    const date = new Date(year, month, 1);
    return (date.getDay() - 1) % 7;
}
module.exports.getStartingIndex = getStartingIndex;