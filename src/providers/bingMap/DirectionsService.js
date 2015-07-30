'use strict';

class DirectionsService extends Microsoft.Maps.Directions.DirectionsManager {
    constructor(map, options, callback) {
        super(map);

        this.setRequestOptions({
            routeMode: Microsoft.Maps.Directions.RouteMode.driving
        });

        if (options.panelSelector) {
            this.setRenderOptions({
                itineraryContainer: document.querySelector(options.panelSelector)
            });
        }

        Microsoft.Maps.Events.addHandler(this, 'directionsUpdated', callback);

        Microsoft.Maps.Events.addHandler(this, 'directionsError', (err) => {
            callback('Unable to calculate a driving itinerary for your destination: ' + err.message);
        });
    }

    getRoute(origin, destination) {
        this.reset();

        let start = new Microsoft.Maps.Directions.Waypoint({address: origin});
        let end = new Microsoft.Maps.Directions.Waypoint({address: destination});

        this.addWaypoint(start);
        this.addWaypoint(end);

        this.calculateDirections();
    }

    reset() {
        this.getMap().entities.clear();

        this.resetDirections({
            removeAllWaypoints: true,
            resetRenderOptions: false,
            resetRequestOptions: false
        });
    }
}

module.exports = DirectionsService;
