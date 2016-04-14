'use strict';

let objectAssign = require('object-assign');

/* jshint newcap: false */
module.exports = {
    mapInstance: function(domId, options, onSuccess) {
        let defaultOptions = {
            center: { coords : {lon: 0, lat: 0}}
        };

        VMLaunch('ViaMichelin.Api.Map', objectAssign(defaultOptions, options, {
            container: $_id(domId)      // jshint ignore:line
        }), {
            onSuccess: onSuccess
        });
    },

    itineraryInstance: function(origin, destination, domId, panelElement, options, callback) {
        VMLaunch('ViaMichelin.Api.Itinerary', {
            map: {
                container: $_id(domId),     // jshint ignore:line
                focus: true
            },
            roadsheet: panelElement,
            steps: [{
                address: {
                    city: origin,
                    countryISOCode: options.region || ''
                }
            }, {
                address: {
                    city: destination,
                    countryISOCode: options.region || ''
                }
            }]
        }, {
            onSuccess: callback
        });
    }
};
