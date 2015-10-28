'use strict';

let objectAssign = require('object-assign');

class DirectionsService extends google.maps.DirectionsService {
    constructor(map, panelSelector) {
        super();

        this.display = new google.maps.DirectionsRenderer();
        this.display.setMap(map);

        if (panelSelector) {
            let panel = document.querySelector(panelSelector);
            panel.innerHTML = '';

            this.display.setPanel(panel);
        }
    }

    getRoute(origin, destination, options, callback, onError) {
        callback = callback || function() {};

        this.route(buildRequest(origin, destination, options), (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.display.setDirections(result);

                callback(result.routes[0]);
            } else {
                onError('Unable to calculate a driving itinerary for the destination: ' + destination);
            }
        });
    }
}

module.exports = DirectionsService;

function buildRequest(origin, destination, options) {
    return objectAssign({
        travelMode: google.maps.TravelMode.DRIVING
    }, options || {}, {
        origin: origin,
        destination: (options.region ? options.region + ' ' + destination : destination)
    });
}
