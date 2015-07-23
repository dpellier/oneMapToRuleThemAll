'use strict';

let objectAssign = require('object-assign');

class DirectionsService {
    constructor(map) {
        this.map = map;
    }

    getRoute(origin, destination, options, callback) {
        ymaps.route([origin, destination]).then((route) => {
            this.map.geoObjects.add(route);
            this.map.setBounds(route.getWayPoints().getBounds());
            callback(route);
        }, () => {
            callback('Unable to calculate a driving itinerary for the destination: ' + destination);
        });
    }
}

// TODO display route text

module.exports = DirectionsService;