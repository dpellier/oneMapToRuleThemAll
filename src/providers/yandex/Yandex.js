'use strict';

/**
 * Yandex Map 2.1
 * API Documentation: https://tech.yandex.com/maps/doc/jsapi/2.1/quick-start/tasks/quick-start-docpage/
 */

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
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

            delete window._yandexCallbackOnLoad;
            callback();
        };

        if (loadingMask) {
            window._yandexCallbackOnLoad = loaderUtils.addLoader(this.domElement, loadingMask, window._yandexCallbackOnLoad);
        }

        domUtils.addScript(this.domElement, 'http://api-maps.yandex.ru/2.1/?load=package.standard&lang=ru-RU&onload=_yandexCallbackOnLoad');
    }

    clickOnMarker(markerId) {
        markerId = markerId.toString();
        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            marker[0].events.fire('click');
        }
    }

    getDirections(origin, destination, options, callback) {
        if (!directionsService) {
            DirectionsService = require('./DirectionsService');

            let map = new YandexMap(this.domElement, this.options.map);
            directionsService = new DirectionsService(map);
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

window.Map = Yandex;
