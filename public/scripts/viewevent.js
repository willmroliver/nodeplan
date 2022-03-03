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

// Same function as used in add-event to display slider value
const timeSlider = document.getElementById("time-in");
const output = document.getElementById("time-in-label");

output.innerHTML = timeSlider.value + " Hours";

timeSlider.addEventListener("input", () => {
    output.innerHTML = timeSlider.value + " Hours";
}, false)

// Here inputs are populated with the current event values
const eventNameIn = document.getElementById("name-in");
const eventDateIn = document.getElementById("datetime-in");
const eventDurationIn = timeSlider;
const eventAddress1In = document.getElementById("address1-in");
const eventPostcodeIn = document.getElementById("postcode-in");

const eventName = document.getElementById("event-name").innerHTML;
const eventDate = document.getElementById("event-date").innerHTML;
const eventTime = document.getElementById("event-time").innerHTML.substring(10);
const eventDuration = document.getElementById("event-duration").innerHTML.substring(10).split(" hours")[0];
output.innerHTML = eventDuration + " hours";
const fullAddressArray = document.getElementById("event-address-full").innerHTML.split(", ");
const eventAddress1 = fullAddressArray[0].substring(9);
const eventPostcode = fullAddressArray[1];

eventNameIn.defaultValue = eventName;
// Some formatting is required for the dateTimeLocal defaultValue
const dateTimeToDefaultValue = (dateString, timeString) => {
    const dateArray = dateString.split('/');

    for (var i = 0; i < 2; i++) {
        if (parseInt(dateArray[i]) < 10) {
            dateArray[i] = '0' + dateArray[i];
        }
    }
    return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0] + 'T' + timeString + ':00';
}
eventDateIn.defaultValue = dateTimeToDefaultValue(eventDate, eventTime);
eventDurationIn.defaultValue = eventDuration;
eventAddress1In.defaultValue = eventAddress1;
eventPostcodeIn.defaultValue = eventPostcode;