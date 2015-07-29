'use strict';

/**
 * ViaMichelin Map v2
 * API Documentation: http://dev.viamichelin.fr/viamichelin-javascript-api.html
 */

/*jshint -W079 */
let Map = require('../../Map');
/* jshint +W079 */

let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let DirectionsService;
let Marker;
let markerClusterer;

let directionsService;
let vmService;

class ViaMichelinMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'ViaMichelin';
        this.markers = [];
    }

    render() {
        let self = this;
        let bounds = [[0, 0], [0, 0]];

        vmService.mapInstance(this.domElement, this.options.map, (map) => {

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
                //let markerClusterer = new MarkerClusterer(map, self.markers, self.options.markerCluster);
                markerClusterer.init(map, self.markers, self.options.markerCluster);
            }
        });
    }

    load(callback, loadingMask) {
        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addResources(this.domElement, [
            domUtils.createScript('//apijsv2.viamichelin.com/apijsv2/api/js?key=' + this.apiKey + '&lang=fra')
        ], () => {
            Marker = require('./Marker');
            markerClusterer = require('./markerClusterer');
            vmService = require('./vmService');
            callback();
        });
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

        directionsService.getRoute(origin, destination, this.options.map, options, callback);
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
