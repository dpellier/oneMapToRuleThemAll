'use strict';

module.exports = {
    render: render,
    defineMarker: defineMarker,
    loadScript: loadScript
};

/**
 * Render the map with a list of given location
 * @param domElement - DOM Element where the map will be appended
 * @param points - List of points to draw
 * @param mapKey - Google Map API Key
 */
function render(domElement, points, apiKey, options) {


    var map;

    //var infowindow = new google.maps.InfoWindow();

    // TODO customize marker options


    map = new google.maps.Map(domElement, options);
    var bounds = new google.maps.LatLngBounds();

    points.forEach(function(point, idx) {
        var marker = createMarker(google, map, point.latitude, point.longitude);
        //bindMarkerClick(google, marker, point, infowindow);
        bounds.extend(marker.position);
        //point._marker = marker;
        //point._markerIdx = idx + 1;
    });

    map.fitBounds(bounds);

}

function createMarker(google, map, latitude, longitude) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map
    });

    return marker;
}


/**
 * TODO
 */
function defineMarker() {

}

/**
 * Load the Leaflet resource
 * @param domElement - DOM Element where the resources will be appended
 * @param callback - function called after all resources are loaded
 * @param mapKey - Google Map API Key
 */
function loadScript(domElement, callback, mapKey) {

    // Add a global callback function to be called when google map script finish loading
    window._googleMapCallbackOnLoad = function() {

        // Remove callback to keep global clean
        delete window._googleMapCallbackOnLoad;
        callback();
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + mapKey;
    domElement.appendChild(script);
}
