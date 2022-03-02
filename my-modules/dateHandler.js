// This function is specifically to handle date strings formatted as given by HTML datetime-local inputs
const getDateInfo = (dateString) => {

    const time = dateString.split('T')[1];

    const theDate = new Date(dateString);
    const dayNo = theDate.getDay();

    var day = "";

    switch (dayNo) {
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

    const date = theDate.getDate();
    const month = theDate.getMonth();
    const year = theDate.getFullYear();

    return {
        'time': time,
        'day': day,
        'date': date,
        'month': month,
        'year': year
    }
}
module.exports.getDateInfo = getDateInfo;

// Specifically converts 0-11 from JS Date() object into name string for Route Parameter
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