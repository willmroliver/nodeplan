function mod(n, m) {
    return ((n % m) + m) % m;
}

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

    document.getElementById('calendar-title').innerHTML = monthToString(month) + " " + year;

    const startOfMonth = new Date(year, month, 1);
    const startingIndex = mod(startOfMonth.getDay() - 1, 7);
    console.log(startingIndex);

    // Attaches CSS classes to active dates and enumerates them
    for (var i = 0; i < 42; i++) {

        const calCell = document.getElementById('cell-no-' + i);
    
        if ((i < 7 && i < startingIndex) || (i >= (monthLen + startingIndex))) {
            calCell.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
        }
        else {
            const cellDate = document.getElementById('cell-date-' + i);
            cellDate.innerHTML = i + 1 - startingIndex;
    
            if (i + 1 - startingIndex == date && isCurrMonth === true) {
                calCell.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
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

// Sets hyperlinks for previous and next to the previous and next monthString
function getPreviousMonth(year, month) {
    
    var newYear = year;
    var newMonth = mod((month - 1), 12);

    if (newMonth === 11) { newYear -= 1; }

    return { year: newYear, month: newMonth };
}
function getNextMonth(year, month) {

    var newYear = year;
    var newMonth = mod((month + 1), 12);

    if (newMonth === 0) { newYear += 1; }

    return { year: newYear, month: newMonth };
}
function setPrevNextLinks(year, month) {
    
    const prevMonth = getPreviousMonth(year, month);
    const nextMonth = getNextMonth(year, month);

    const prevLink = '/my-plan/'+prevMonth.year+'/'+monthToString(prevMonth.month).toLowerCase();
    const nextLink = '/my-plan/'+nextMonth.year+'/'+monthToString(nextMonth.month).toLowerCase();

    document.getElementById('cal-prev').href = prevLink;
    document.getElementById('cal-next').href = nextLink;

    console.log(document.getElementById('cal-prev').href);
}

// Server passes year and month for calender rendering to client-side script;
// Uses innerHTMLs of divs given by below IDs, which are then cleared.
var yearPassed = parseInt(document.getElementById('route-year-passer').innerHTML)
var monthPassed = parseInt(document.getElementById('route-month-passer').innerHTML)

document.getElementById('route-year-passer').innerHTML = '';
document.getElementById('route-month-passer').innerHTML = '';

generateCalendar(yearPassed, monthPassed);
setPrevNextLinks(yearPassed, monthPassed);

