'use strict';

let objectAssign = require('object-assign');
let vmService = require('./vmService');

class DirectionsService {
    constructor(domElement, panelSelector) {
        this.domElement = domElement;
        this.panelElement = document.querySelector(panelSelector);
    }

    getRoute(origin, destination, mapOptions, options, callback) {
        let self = this;

        if (!self.map) {
            vmService.mapInstance(this.domElement, objectAssign({}, mapOptions, {center : ViaMichelin.Api.Constants.Map.DELAY_LOADING}), (map) => {
                self.map = map;

                vmService.itineraryInstance(origin, destination, self.domElement, self.panelElement, options, (itinerary) => {
                    callback(itinerary);
                });
            });
        } else {
            // TODO fix: does nothing
            self.map.removeAllLayers();
            self.panelElement.innerHTML = '';

            vmService.itineraryInstance(origin, destination, self.domElement, self.panelElement, options, (itinerary) => {
                callback(itinerary);
            });
        }
    }
}

module.exports = DirectionsService;
