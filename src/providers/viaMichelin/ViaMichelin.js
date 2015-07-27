'use strict';

/**
 * ViaMichelin Map v2
 * API Documentation: http://dev.viamichelin.fr/viamichelin-javascript-api.html
 */

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let objectAssign = require('object-assign');
let DirectionsService;
let Marker;
let MarkerClusterer;

let directionsService;

class ViaMichelinMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'ViaMichelin';
        this.map = '';
        this.markers = [];
        this.cluster = null;
    }

    render() {
        let map = '';
        let self = this;
        let bounds = [[0, 0], [0, 0]];

        // Init the map
        VMLaunch('ViaMichelin.Api.Map', objectAssign({}, this.options.map, {
            container: this.domElement
        }), {
            onInit: function(newMap) {
                map = newMap;
                Marker = require('./Marker');
                MarkerClusterer = require('./MarkerClusterer');
            },
            onSuccess: function() {
                // Create a marker for each point
                self.points.forEach((point) => {
                    let marker = new Marker(point, self.options.marker, self.options.activeInfoWindow);
                    self.markers.push(marker);

                    map.addLayer(marker);

                    bounds = getLargestBounds(bounds, point);
                });

                // Center the map
                map.drawMap({geoBoundaries: {no: {lon: bounds[0][1], lat: bounds[0][0]}, se:{lon: bounds[1][1], lat: bounds[1][0]}}}, 16);

                // Init the clustering if the option is set
                if (self.options.activeCluster) {
                    new MarkerClusterer(map, self.markers, self.options.markerCluster);
                }
            }
        });
    }

    load(callback, loadingMask) {
        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addResources(this.domElement, [
            domUtils.createScript('//apijsv2.viamichelin.com/apijsv2/api/js?key=' + this.apiKey + '&lang=fra')
        ], callback);
    }

    clickOnMarker(markerId) {
        markerId = markerId.toString();
        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            marker[0]._triggerClickEvent();
        }
    }

    getDirections(origin, destination, options, callback) {
        if (!directionsService) {
            DirectionsService = require('./DirectionsService');
            directionsService = new DirectionsService(this.domElement, options.panelSelector);
        }

        directionsService.getRoute(origin, destination, options, callback);
    }
}

function getLargestBounds(bounds, point) {
    return [
        [
            bounds[0][0] ? Math.min(bounds[0][0], point.latitude) : point.latitude,
            bounds[0][1] ? Math.min(bounds[0][1], point.longitude) : point.longitude
        ], [
            Math.max(bounds[1][0], point.latitude),
            Math.max(bounds[1][1], point.longitude)
        ]
    ];
}

window.Map = ViaMichelinMap;
