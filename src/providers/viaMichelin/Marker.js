'use strict';

let objectAssign = require('object-assign');

class Marker {
    constructor(point, options) {
        let opts = objectAssign({}, options);

        if (options && options.overlayText && typeof options.overlayText.text === 'function') {
            objectAssign(opts, {
                overlayText: {
                    text:options.overlayText.text(point) || ''
                }
            });
        }

        if (options && options.title && typeof options.title.text === 'function') {
            objectAssign(opts, {
                title: options.title.text(point) || ''
            });
        }

        let marker = new ViaMichelin.Api.Map.Marker(objectAssign(opts, {
            coords: {lon: parseFloat(point.longitude), lat: parseFloat(point.latitude)} // Parse float : security for lat/lng passed in string (create a bug on clusters)
        }));

        marker.id = point.id;

        if (options && options.activeInfoWindow) {
            if (typeof options.htm === 'function') {

                marker.addEventListener('onClick', () => {
                    marker.setBubbleContent(options.htm(point.data) || '');
                });
            }
            else {
                marker.setBubbleContent(options.htm);
            }
        }

        return marker;
    }
}

module.exports = Marker;
