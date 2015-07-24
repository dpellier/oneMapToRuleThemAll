'use strict';

let objectAssign = require('object-assign');

class DirectionsService {
    constructor(domElement, panelSelector) {
        this.domElement = domElement;
        this.panelElement = document.querySelector(panelSelector);
    }

    getRoute(origin, destination, options, callback) {
        let self = this;

        this.initMap(() => {
            VMLaunch('ViaMichelin.Api.Itinerary', {
                map: {
                    container: self.domElement,
                    focus: true
                },
                roadsheet: self.panelElement,
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
                onSuccess: callback,
                onError: function() {
                    callback('Unable to calculate a driving itinerary for the destination: ' + destination);
                }
            });
        });
    }

    initMap(callback) {
        let self = this;

        if (!self.map) {
            VMLaunch('ViaMichelin.Api.Map', {
                container : self.domElement,
                center : ViaMichelin.Api.Constants.Map.DELAY_LOADING
            }, {
                onInit: function(serviceMap) {
                    self.map = serviceMap;
                },
                onSuccess: function() {
                    callback();
                }
            });
        } else {
            self.map.removeAllLayers();

            self.domElement.innerHTML = "";
            self.panelElement.innerHTML = '';

            callback();
        }
    }
}

module.exports = DirectionsService;
