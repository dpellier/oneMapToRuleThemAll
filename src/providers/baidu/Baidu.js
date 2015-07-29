'use strict';

/**
 * Baidu Map 2.0
 * API Documentation: http://developer.baidu.com/map/index.php?title=jspopular
 * Demo: http://developer.baidu.com/map/jsdemo.htm
 */

/*jshint -W079 */
let Map = require('../../Map');
/* jshint +W079 */

let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
//let DirectionsService;
let Marker;
let BaiduMap;

//let directionsService;

class Baidu extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Baidu';
        this.map = '';
        this.markers = [];
    }

    render() {
        // Init the map
        this.map = new BaiduMap(this.domElement, this.options.map);

        // Create a marker for each point
        this.points.forEach((point) => {
            let marker = new Marker(point, this.options.marker, this.options.markerLabel);
            this.map.addOverlay(marker);
            this.markers.push(marker);

            // Bind the info window on marker click if the option is set
            if (this.options.activeInfoWindow) {
                marker.addEventListener('click', (e) => {
                    let infoWindow = new BMap.InfoWindow(this.options.infoWindow.message(point.data) || '', this.options.infoWindow);

                    this.map.openInfoWindow(infoWindow, e.target.getPosition());
                });
            }
        });

        // Center the map
        this.map.setViewport(this.markers.map((marker) => {
            return marker.getPosition();
        }));

        // Init the clustering if the option is set
        if (this.options.activeCluster) {
            let markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers: this.markers});

            markerClusterer.setStyles([this.options.markerCluster.style]);
        }
    }

    load(callback, loadingMask, clustered) {
        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addResources(this.domElement, [
            domUtils.createScript('//api.map.baidu.com/getscript?v=2.0&ak=' + this.apiKey + '&t=' + new Date().getTime())
        ], () => {
            BaiduMap = require('./Map');
            Marker = require('./Marker');

            if (clustered) {
                domUtils.addResources(this.domElement, [
                    domUtils.createScript('//api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js'),
                    domUtils.createScript('//api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js')
                ], callback);
            } else {
                callback();
            }
        });
    }

    clickOnMarker(markerId) {
        markerId = markerId.toString();
        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            marker[0].dispatchEvent('click');
        }
    }

    //getDirections(origin, destination, options, callback) {
    //    if (!directionsService) {
    //        DirectionsService = require('./DirectionsService');
    //
    //        let map = new YandexMap(this.domElement, this.options.map);
    //        directionsService = new DirectionsService(map);
    //    }
    //
    //    directionsService.getRoute(origin, destination, options, callback);
    //}
}

window.Map = Baidu;
