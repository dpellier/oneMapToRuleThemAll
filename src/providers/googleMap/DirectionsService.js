'use strict';

let objectAssign = require('object-assign');

class DirectionsService extends google.maps.DirectionsService {
    constructor(map, panelSelector) {
        super();

        this.display = new google.maps.DirectionsRenderer();
        this.display.setMap(map);

        if (panelSelector) {
            this.display.setPanel(document.querySelector(panelSelector));
        }
    }

    getRoute(origin, destination, options, callback) {
        this.route(buildRequest(origin, destination, options), (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.display.setDirections(result);

                if (callback) {
                    callback(result.routes[0]);    // TODO format this to be the same between all providers
                }
            } else {
                callback('Unable to calculate a driving itinerary for the destination: ' + destination);
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