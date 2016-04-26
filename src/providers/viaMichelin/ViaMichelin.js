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
        this.cluster = null;
        this.center = null;
    }

    render(callback) {
        let self = this;

        vmService.mapInstance(this.domId, this.options.map, (map) => {
            this.map = map;

            // Create a marker for each point
            this.addMarkers(self.points);

            const bounds = this.getBounds();
            this.map.drawMap({geoBoundaries: {no: {lon: bounds[0][1], lat: bounds[0][0]}, se:{lon: bounds[1][1], lat: bounds[1][0]}}}, 16);
            this.center = this.map.getCenter();

            this.setCluster();

            if (callback) {
                callback();
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

    getBounds() {
        let bounds = [[0, 0], [0, 0]];

        this.points.forEach((point) => {
            bounds = getLargestBounds(bounds, point);
        });

        return bounds;
    }

    setBounds() {
        this.map.drawMapFromLayers();
    }

    setIconOnMarker(markerId, icon) {
        markerId = markerId.toString();

        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length && icon) {
            marker[0].setIcon(icon);
        }
    }

    clickOnMarker(markerId) {
        this.focusOnMarker(markerId, true, true);
    }

    focusOnMarker(markerId, showInfoWindow = false, pan = false) {
        markerId = markerId.toString();

        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            if (pan) {
                this.map.moveTo(marker[0].getPosition());
            }

            if (showInfoWindow) {
                marker[0]._triggerClickEvent();
            }
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

    addMarkers(points) {
        if (Object.prototype.toString.call(points) !== '[object Array]') {
            points = [points];
        }

        let markers = [];
        let options = {};
        let activeInfoWindow;

        for(let i = 0; i < points.length; i++) {
            options = Object.assign({}, this.options.marker, points[i].options ? points[i].options : {});
            activeInfoWindow = points[i].activeInfoWindow !== undefined ? points[i].activeInfoWindow : this.options.activeInfoWindow;

            points[i].options = options;
            points[i].activeInfoWindow = activeInfoWindow;

            if (this.map) {
                const marker = new Marker(points[i], options, activeInfoWindow);
                markers.push(marker);
                this.markers.push(marker);
                this.map.addLayer(marker);
            }
        }
        this.setCluster();

        return markers;
    }

    setCluster() {
        // Init the clustering if the option is set
        if (this.options.activeCluster) {
            if (this.cluster) {
                // Reset all markers & clusters because ViaMichelin API does not allow it...
                this.map.removeAllLayers();
                this.cluster.clear();

                // Redraw each markers
                this.markers.forEach((marker) => {
                    this.map.addLayer(marker);
                });
            }
            this.cluster = markerClusterer.init(this.map, this.markers, this.options.markerCluster);
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
