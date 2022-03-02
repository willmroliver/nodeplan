const monthToString = (monthInt) => {

    switch (monthInt) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
    }
}

const lengthOfMonth = (monthNo, year) => {
    
    switch (monthNo) {
        case 0:
            return 31;
        case 1:
            if (year % 4 == 0) {
                return 29;
            } else {
                return 28;
            }
        case 2:
            return 31;
        case 3:
            return 30;
        case 4:
            return 31;
        case 5:
            return 30;
        case 6:
            return 31;
        case 7:
            return 31;
        case 8:
            return 30;
        case 9:
            return 31;
        case 10:
            return 30;
        case 11:
            return 31;
    }
}

const today = new Date();

function generateCalendar(year, month) {

    const currDate = new Date();
    const date = currDate.getDate();

    const monthLen = lengthOfMonth(month, year);

    var isCurrMonth = true;
    if (month == currDate.getMonth() && year == currDate.getFullYear()) { isCurrMonth = true } 
    else { isCurrMonth = false }

    document.getElementById('calendar-title').innerHTML = monthToString(month);

    const startOfMonth = new Date(year, month, 1);
    const startingIndex = (startOfMonth.getDay() - 1) % 7;

    // Attaches CSS classes to active dates and enumerates them
    for (var i = 0; i < 35; i++) {

        const calCell = document.getElementById('cell-no-' + i);
    
        if ((i < 7 && i < startingIndex) || (i >= (monthLen + startingIndex))) {
            calCell.style.background = 'none';
        }
        else {
            const cellDate = document.getElementById('cell-date-' + i);
            cellDate.innerHTML = i + 1 - startingIndex;
    
            if (i + 1 - startingIndex == date && isCurrMonth === true) {
                calCell.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
            }
        }
    }

    // Sets event hyperlinks to route for VIEWEVENTS.EJS
    const eventLinks = document.getElementsByClassName('event-name');

    for (var i = 0; i < eventLinks.length; i++) {
        const eventLink = eventLinks[i];
        eventLink.href = '/my-plan/'+ year + '/' + monthToString(month).toLowerCase() + '/' + eventLink.innerHTML;
    }
}

// Server passes year and month for calender rendering to client-side script;
// Uses innerHTMLs of divs given by below IDs, which are then cleared.
var yearPassed = parseInt(document.getElementById('route-year-passer').innerHTML)
var monthPassed = parseInt(document.getElementById('route-month-passer').innerHTML)

document.getElementById('route-year-passer').innerHTML = '';
document.getElementById('route-month-passer').innerHTML = '';

generateCalendar(yearPassed, monthPassed);