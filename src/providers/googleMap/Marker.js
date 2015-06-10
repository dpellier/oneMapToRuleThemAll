'use strict';

let objectAssign = require('object-assign');

class Marker extends google.maps.Marker {
    constructor(map, point, icon) {
        let marker = {
            position: new google.maps.LatLng(point.latitude, point.longitude),
            map: map
        };

        if (icon) {
            objectAssign(marker, {
                icon: icon
            });
        }

        super(marker);
        this.id = point.id;
    }
}

module.exports = Marker;
