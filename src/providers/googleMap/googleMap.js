'use strict';

var Map = require('../../Map');

class GoogleMap extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Google Map';
    }

    render(loadingMask) {
        // TODO loadingMask

        var map = new google.maps.Map(this.domElement, this.options);
        var bounds = new google.maps.LatLngBounds();

        this.points.forEach(function(point) {
            var marker = createMarker(google, map, point.latitude, point.longitude);
            bounds.extend(marker.position);
        });

        map.fitBounds(bounds);
    }

    loadFiles(callback) {

        // Add a global callback function to be called when google map script finish loading
        window._googleMapCallbackOnLoad = function() {

            // Remove callback to keep global clean
            delete window._googleMapCallbackOnLoad;
            callback();
        };

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey;

        this.domElement.appendChild(script);
    }
}

function createMarker(google, map, latitude, longitude) {
    return new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map
    });
}

window.Map = GoogleMap;
