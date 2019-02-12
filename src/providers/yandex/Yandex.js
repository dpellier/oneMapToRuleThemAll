'use strict';

/**
 * Yandex Map 2.1
 * API Documentation: https://tech.yandex.com/maps/doc/jsapi/2.1/quick-start/tasks/quick-start-docpage/
 */

/*jshint -W079 */
let Map = require('../../Map');
/* jshint +W079 */

let domUtils = require('../../utils/dom');
let ieUtils = require('../../utils/ie');
let loaderUtils = require('../../utils/loader');
let DirectionsService;
let Marker;
let YandexMap;

let directionsService;

class Yandex extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Yandex';
        this.map = '';
        this.markers = [];
        this.cluster = null;
    }

    render() {
        // Init the map
        this.map = new YandexMap(this.domElement, this.options.map);
        let bounds = [[0, 0], [0, 0]];

        // Init the clustering if the option is set
        if (this.options.activeCluster) {
            this.cluster = new ymaps.Clusterer(this.options.markerCluster);
            this.map.geoObjects.add(this.cluster);
        }

        // Create a marker for each point
        this.points.forEach((point) => {
            let marker = new Marker(point, this.options.marker, this.options.activeInfoWindow);
            this.markers.push(marker);

            this.map.geoObjects.add(marker);

            if (this.options.activeCluster) {
                this.cluster.add(marker);
            }
            bounds = getLargestBounds(bounds, point);
        });

        // Center the map
        this.map.setBounds(bounds);

        // If one marker: readjust zoom because bounds are too small to show tiles
        if (this.points && this.points.length === 1) {
            this.setZoom(this.getDefaultZoomLevel());
        }
    }

    getDefaultZoomLevel() {
        return (this.options && this.options.map && this.options.map.zoom) || 16;
    }

    load(callback, loadingMask) {
        if (window.ymaps && window.ymaps.Map) {
            callback();
            return;
        }

        window._yandexCallbackOnLoad = function() {
            // Require yandex object here cause they're not loaded before
            YandexMap = require('./Map');
            Marker = require('./Marker');

            ieUtils.delete(window, '_yandexCallbackOnLoad');
            callback();
        };

        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addScript(this.domElement, '//api-maps.yandex.ru/2.1/?load=package.standard&onload=_yandexCallbackOnLoad&lang=' + this.locale);
    }

    setZoom(level) {
        if (this.map) {
            this.map.setZoom(level);
        }
    }

    clickOnMarker(markerId) {
        this.focusOnMarker(markerId);
    }

    // Use focusOnMarker instead, this one is for retro compat
    focusOnMarker(markerId, showInfoWindow = false, pan = false, zoom = undefined) {
        markerId = markerId.toString();
        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });



        if (marker.length) {
            this.map.setCenter(marker[0].geometry.getCoordinates());
            this.map.setZoom(zoom === undefined ? this.getDefaultZoomLevel() : zoom);
            marker[0].events.fire('click');
        }
    }

    getDirections(origin, destination, options, callback, onError) {
        if (!directionsService) {
            DirectionsService = require('./DirectionsService');

            let map = new YandexMap(this.domElement, this.options.map);
            directionsService = new DirectionsService(map);
        }

        directionsService.getRoute(origin, destination, options, callback, onError);
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

window.Map = Yandex;
window.OneMap = Yandex;
