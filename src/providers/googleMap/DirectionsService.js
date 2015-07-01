'use strict';

let objectAssign = require('object-assign');

class DirectionsService extends google.maps.DirectionsService {
    constructor(origin, destination, options, callback) {
        super();

        if (options.panelSelector) {
            this.panel = document.querySelector(options.panelSelector);
            delete options.panelSelector;
        }

        this.request = objectAssign({
            travelMode: google.maps.TravelMode.DRIVING
        }, options || {}, {
            origin: origin,
            destination: (options.region ? options.region + ' ' + destination : destination)
        });

        this.callback = callback || function() {};
    }

    requestRoute(callback) {
        this.route(this.request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                callback(result);
            }
        });
    }

    getRouteWithMap(map) {
        let display = new google.maps.DirectionsRenderer();
        display.setMap(map);

        this.requestRoute((result) => {
            display.setDirections(result);

            if (this.panel) {
                display.setPanel(this.panel);
            }

            this.callback(result.routes[0]);    // TODO format this to be the same between all providers
        });
    }
}

module.exports = DirectionsService;
