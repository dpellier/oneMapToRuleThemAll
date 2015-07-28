'use strict';

let objectAssign = require('object-assign');

module.exports = {
    mapInstance: function(domElement, options, onSuccess) {
        let defaultOptions = {
            center: { coords : {lon: 0, lat: 0}}
        };

        VMLaunch('ViaMichelin.Api.Map', objectAssign(defaultOptions, options, {
            container: domElement
        }), {
            onSuccess: onSuccess
        });
    },

    itineraryInstance: function(origin, destination, domElement, panelElement, options, callback) {
        VMLaunch('ViaMichelin.Api.Itinerary', {
            map: {
                container: domElement,
                focus: true
            },
            roadsheet: panelElement,
            steps: [{
                address: {
                    city: origin,
                    countryISOCode: options.region || 'FRA'
                }
            }, {
                address: {
                    city: destination,
                    countryISOCode: options.region || 'FRA'
                }
            }]
        }, {
            onSuccess: callback
        });
    }
};
