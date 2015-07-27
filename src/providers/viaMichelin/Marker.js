'use strict';

let objectAssign = require('object-assign');

class Marker {
    constructor(point, options, infoWindow) {
        let opts = objectAssign({}, options);

        if (infoWindow) {
            if (typeof options.htm === 'function') {
                objectAssign(opts, {
                    htm: options.htm(point.data) || ''
                });
            }
        } else {
            delete opts.htm;
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
