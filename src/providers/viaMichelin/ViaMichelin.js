'use strict';

/**
 * ViaMichelin Map v2
 * API Documentation: http://dev.viamichelin.fr/viamichelin-javascript-api.html
 */

/*jshint -W079 */
let AbstractMap = require('../../AbstractMap');
/* jshint +W079 */

let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let objectAssign = require('object-assign');
let DirectionsService;
let Marker;
let markerClusterer;

let directionsService;
let vmService;

class ViaMichelinMap extends AbstractMap {
    constructor(...args) {
        super(...args);

        this.provider = 'ViaMichelin';
        this.map = null;
        this.markers = [];
        this.markerClusterers = [];
        this.center = null;
    }

    render(callback) {
        let self = this;

        vmService.mapInstance(this.domId, this.options.map, (map) => {
            this.map = map;

            // Create a marker for each point
            this.addMarkers(self.points, 0);

            const bounds = this.getBounds();
            const zoom = this.options.map.zoom || 16;

            this.map.drawMap({geoBoundaries: {no: {lon: bounds[0][1], lat: bounds[0][0]}, se:{lon: bounds[1][1], lat: bounds[1][0]}}}, 16);
            this.center = this.map.getCenter();

            // Force zoom redraw and recenter marker
            if (self.points.length === 1) {
                this.map.moveTo({
                    lon: self.points[0].longitude,
                    lat: self.points[0].latitude
                });
                this.map.setZoomLevel(zoom);
            }

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
                domUtils.createScript('//secure-apijs.viamichelin.com/apijsv2/api/js?key=' + this.apiKey + '&lang=' + this.locale + '&protocol=https')
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

    addMarkers(points, clusterIndex = null, clusterConfig = null) {
        if (Object.prototype.toString.call(points) !== '[object Array]') {
            points = [points];
        }

        let markers = [];
        let options = {};

        for(let i = 0; i < points.length; i++) {
            options = objectAssign({}, this.options.marker, points[i].options ? points[i].options : {});

            if (typeof options.activeInfoWindow === 'undefined' || options.activeInfoWindow === null) {
                options.activeInfoWindow = this.options.activeInfoWindow;
            }

            if (typeof options.activeCluster === 'undefined' || options.activeCluster === null) {
                options.activeCluster = this.options.activeCluster;
            }

            points[i].options = options;

            if (this.map) {
                const marker = new Marker(points[i], options);
                markers.push(marker);
                this.markers.push(marker);
                this.map.addLayer(marker);
            }
        }

        this.setCluster(markers, clusterIndex, clusterConfig);

        return markers;
    }

    setCluster(markers, clusterIndex = null, clusterConfig = null) {
        if (this.map && this.options.activeCluster && clusterIndex !== null) {

            if (!clusterConfig) {
                clusterConfig = this.options.markerCluster;
            }

            if (this.markerClusterers[clusterIndex]) {
                for(let i = 0; i < markers.length; i++) {
                    this.markerClusterers[clusterIndex].markers.push(markers[i]);
                }
            }
            else {
                let cluster = markerClusterer.init(this.map, markers, clusterConfig);
                this.markerClusterers.push(cluster);
            }
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

window.ViaMichelinMap = ViaMichelinMap;
window.OneMap = ViaMichelinMap;
