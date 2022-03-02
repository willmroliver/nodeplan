const timeSlider = document.getElementById("time-in");
const output = document.getElementById("time-in-label");

output.innerHTML = timeSlider.value + " Hours";

timeSlider.addEventListener("input", () => {
    output.innerHTML = timeSlider.value + " Hours";
}, false)