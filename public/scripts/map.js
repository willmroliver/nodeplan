let map;
let marker;

const initLocation = { lat: 51.507, lng: -0.128 };

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: initLocation,
        zoom: 16,
    });
    marker = new google.maps.Marker({
        position: initLocation,
        map: map
    })

    const fullAddress = document.getElementById("event-address-full").innerHTML;
    geocodeRequest(fullAddress, map, marker);
}

const geocodeRequest = async (address, map, marker) => {

    const geocoder = new google.maps.Geocoder();
    const geocodeResponse = await geocoder.geocode({address: address});

    const latLng = geocodeResponse.results[0].geometry.location;

    map.setCenter(latLng);
    marker.setPosition(latLng);
}


var latLng = geocodeRequest(fullAddress);

console.log(latLng.lat());
console.log(latLng.lng());