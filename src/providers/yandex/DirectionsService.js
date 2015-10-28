'use strict';

class DirectionsService {
    constructor(map) {
        this.map = map;
    }

    getRoute(origin, destination, options, callback, onError) {
        ymaps.route([origin, destination]).then((route) => {
            this.map.geoObjects.add(route);
            this.map.setBounds(route.getWayPoints().getBounds());
            callback(route);
        }, () => {
            onError('Unable to calculate a driving itinerary for the destination: ' + destination);
        });
    }
}

module.exports = DirectionsService;
