'use strict';

let objectAssign = require('object-assign');

class DirectionsService extends Microsoft.Maps.Directions.DirectionsManager {
    constructor(map) {
        super(map);

        this.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.driving
        });
    }

    getRoute(origin, destination, options, callback) {
        this.resetDirections();

        let start = new Microsoft.Maps.Directions.Waypoint({address: origin});
        let end = new Microsoft.Maps.Directions.Waypoint({address: destination});

        this.addWaypoint(start);
        this.addWaypoint(end);

        if (options.panelSelector) {
            this.setRenderOptions({
                itineraryContainer: document.querySelector(options.panelSelector)
            });
        }

        Microsoft.Maps.Events.addHandler(this, 'directionsUpdated', (route) => {
            this.dispose();
            callback(route);
        });

        Microsoft.Maps.Events.addHandler(this, 'directionsError', () => {
            this.dispose();
            callback('Unable to calculate a driving itinerary for the destination: ' + destination);
        });

        this.calculateDirections();
    }
}

module.exports = DirectionsService;
