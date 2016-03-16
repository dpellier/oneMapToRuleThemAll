'use strict';

let objectAssign = require('object-assign');
let vmService = require('./vmService');

class DirectionsService {
    constructor(domId, panelSelector) {
        this.domId = domId;
        this.panelElement = document.querySelector(panelSelector);
    }

    getRoute(origin, destination, mapOptions, options, callback) {
        let self = this;

        if (!self.map) {
            vmService.mapInstance(this.domId, objectAssign({}, mapOptions, {center : ViaMichelin.Api.Constants.Map.DELAY_LOADING}), (map) => {
                self.map = map;

                vmService.itineraryInstance(origin, destination, self.domId, self.panelElement, options, (itinerary) => {
                    callback(itinerary);
                });
            });
        } else {
            self.map.removeAllLayers();
            self.panelElement.innerHTML = '';

            vmService.itineraryInstance(origin, destination, self.domId, self.panelElement, options, (itinerary) => {
                callback(itinerary);
            });
        }
    }
}

module.exports = DirectionsService;
