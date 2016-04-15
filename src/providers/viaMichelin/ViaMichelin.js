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
        this.map = null;
        this.markers = [];
    }

    render() {
        let self = this;
        let bounds = [[0, 0], [0, 0]];

        vmService.mapInstance(this.domId, this.options.map, (map) => {
            this.map = map;

            // Create a marker for each point
            self.points.forEach((point) => {
                this.addPoint(point, {}, self.options.activeInfoWindow);
                bounds = getLargestBounds(bounds, point);
            });

            // Center the map
            map.drawMap({geoBoundaries: {no: {lon: bounds[0][1], lat: bounds[0][0]}, se:{lon: bounds[1][1], lat: bounds[1][0]}}}, 16);

            // Init the clustering if the option is set
            if (self.options.activeCluster) {
                markerClusterer.init(map, self.markers, self.options.markerCluster);
            }
        });
    }

    load(callback, loadingMask) {
        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        if (window.VMLaunch) {
            callback();
        } else {
            domUtils.addResources(this.domElement, [
                domUtils.createScript('//apijsv2.viamichelin.com/apijsv2/api/js?key=' + this.apiKey + '&lang=' + this.locale)
            ], () => {
                Marker = require('./Marker');
                markerClusterer = require('./markerClusterer');
                vmService = require('./vmService');
                callback();
            });
        }
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
            directionsService = new DirectionsService(this.domId, options.panelSelector);
        }

        directionsService.getRoute(origin, destination, this.options.map, options, callback);
    }

    setCenter(lat, lng) {
        if(this.map) {
            this.map.panTo({
                lon: lng,
                lat: lat
            });
        }
    }

    setZoom (level) {
        if(this.map) {
            this.map.setZoomLevel(level);
        }
    }

    addPoint(point, customOptions = {}, activeInfoWindow = false) {
        const options = Object.assign({}, this.options.marker, customOptions);

        if (this.map) {
            const marker = new Marker(point, options, activeInfoWindow);
            this.map.addLayer(marker);
            this.markers.push(marker);
        }
    }
}

function getLargestBounds(bounds, point) {
    return [
        [
            bounds[0][0] ? Math.min(bounds[0][0], point.latitude) : point.latitude,
            bounds[0][1] ? Math.min(bounds[0][1], point.longitude) : point.longitude
        ], [
            bounds[1][0] ? Math.max(bounds[1][0], point.latitude) : point.latitude,
            bounds[1][0] ? Math.max(bounds[1][1], point.longitude) : point.longitude
        ]
    ];
}

window.Map = ViaMichelinMap;
