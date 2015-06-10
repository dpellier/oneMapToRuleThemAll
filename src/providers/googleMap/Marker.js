'use strict';

let objectAssign = require('object-assign');
let Label = require('./Label');

class Marker extends google.maps.Marker {
    constructor(map, point, options) {
        let marker = {
            position: new google.maps.LatLng(point.latitude, point.longitude),
            map: map
        };

        if (options.icon) {
            objectAssign(marker, {
                icon: options.icon
            });
        }

        super(marker);
        this.id = point.id;

        if (options.label) {
            new Label({
                map: map,
                position: this.getPosition()
            }, point, options.label);
        }
    }
}

module.exports = Marker;
