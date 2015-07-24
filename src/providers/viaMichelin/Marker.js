'use strict';

let objectAssign = require('object-assign');

class Marker {
    constructor(point, options) {
        let opts = objectAssign({}, options);

        if (typeof options.htm === 'function') {
            objectAssign(opts, {
                htm: options.htm(point.data) || ''
            });
        }

        if (options.overlayText && typeof options.overlayText.text === 'function') {
            objectAssign(opts, {
                overlayText: {
                    text:options.overlayText.text(point) || ''
                }
            });
        }

        let marker = new ViaMichelin.Api.Map.Marker(objectAssign(opts, {
            coords: {lon: point.longitude, lat: point.latitude}
        }));

        marker.id = point.id;

        return marker;
    }
}

module.exports = Marker;
