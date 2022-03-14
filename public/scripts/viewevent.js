const editButton = document.getElementById('edit-event-btn');
const cancelButton = document.getElementById('cancel-btn');
const popupWindow = document.getElementById('edit-event-popup');
const popupBackground = document.getElementById('popup-background');


// Edit and cancel buttons work simply by showing and hiding the editor.
editButton.addEventListener('click', () => {
    popupWindow.classList.replace('contents-hidden', 'edit-event-popup')
    popupBackground.classList.add('popup-background');
})
cancelButton.addEventListener('click', () => {
    popupWindow.classList.replace('edit-event-popup', 'contents-hidden')
    popupBackground.classList.remove('popup-background');
})


// Here inputs are populated with the current event values
const eventNameIn = document.getElementById("name-in");
const startDateTimeIn = document.getElementById("start-datetime-in");
const endDateTimeIn = document.getElementById("end-datetime-in");
const eventAddress1In = document.getElementById("address1-in");
const eventPostcodeIn = document.getElementById("postcode-in");

const eventName = document.getElementById("event-name").innerHTML;
const fullAddressArray = document.getElementById("event-address-full").innerHTML.split(", ");
const eventAddress1 = fullAddressArray[0];
const eventPostcode = fullAddressArray[1];


eventNameIn.defaultValue = eventName;
eventAddress1In.defaultValue = eventAddress1;
eventPostcodeIn.defaultValue = eventPostcode;
// Some formatting is required for the dateTimeLocal defaultValue
const dateTimeToDefaultValue = (dateTimeIn) => {

    dateTimeArray = dateTimeIn.innerHTML.split(', ');
    const timeString = dateTimeArray[0];
    const dateString = dateTimeArray[1];

    const dateArray = dateString.split('/');
    for (var i = 0; i < 2; i++) {
        if (parseInt(dateArray[i]) < 10) {
            dateArray[i] = '0' + dateArray[i];
        }
    }
    
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] + 'T' + timeString;
}
startDateTimeIn.defaultValue = dateTimeToDefaultValue(startDateTimeIn.innerHTML);
endDateTimeIn.defaultValue = dateTimeToDefaultValue(endDateTimeIn.innerHTML);
