'use strict';

let objectAssign = require('object-assign');

class Marker {
    constructor(point, options) {
        let opts = objectAssign({}, options);

        if (typeof options.text === 'function') {
            objectAssign(opts, {
                text: options.text(point)
            });
        }

        let location = new Microsoft.Maps.Location(point.latitude, point.longitude);
        let marker = new Microsoft.Maps.Pushpin(location, opts);

        marker.id = point.id;
        marker.latitude = point.latitude;
        marker.longitude = point.longitude;

        return marker;
    }
}

module.exports = Marker;
