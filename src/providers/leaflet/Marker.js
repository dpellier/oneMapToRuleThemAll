'use strict';

let objectAssign = require('object-assign');
let Label = require('./Label');

class Marker extends L.Marker {
    constructor(point, options) {

        if (options.label) {
            super([point.latitude, point.longitude], objectAssign({}, options, {
                icon: new Label(options.label(point), options.icon)
            }));
        } else {
            super([point.latitude, point.longitude], objectAssign({}, options, {
                icon: L.icon(options.icon)
            }));
        }

        this.id = point.id;
    }
}

module.exports = Marker;
