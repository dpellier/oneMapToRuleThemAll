'use strict';

let objectAssign = require('object-assign');

class Marker extends google.maps.Marker {
    constructor(map, point, icon) {
        let marker = {
            position: new google.maps.LatLng(point.latitude, point.longitude),
            map: map
        };

        if (icon) {
            objectAssign(marker, icon);
        }

        super(marker);
    }
}

module.exports = Marker;
