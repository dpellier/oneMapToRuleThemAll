'use strict';

/**
 * Mappy Map
 * API Documentation: http://leafletjs.com/reference.html
 */

/*jshint -W079 */
const Map = require('../../Map');
/* jshint +W079 */

const domUtils = require('../../utils/dom');
const loaderUtils = require('../../utils/loader');

let MappyMap;
let Marker;

class Mappy extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Mappy';
        this.markers = [];
    }

    render(callback) {
        this.map = new MappyMap(this.domId, this.options.map);
        this.markers = [];

        this.addMarkers(this.points);

        this.setBounds();

        if (callback) {
            callback();
        }
    }

    load(callback, loadingMask) {
        if (window.L && window.L.Mappy) {
            callback();
            return;
        }

        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addResources(document.body, [
            domUtils.createScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.js'),
            domUtils.createStyle('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.css')
        ], () => {
            domUtils.addResources(document.body, [
                domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/Mappy/L.Mappy.js'),
                domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/Mappy/L.Mappy.css')
            ], () => {
                MappyMap = require('./Map');
                Marker = require('./Marker');

                callback();
            });
        });
    }

    setBounds() {
        this.map.fitBounds(this.markers.map((marker) => {
            return marker.getLatLng();
        }));
    }

    addMarkers(points) {
        points.forEach((point) => {
            const marker = new Marker(point, this.options.marker);

            if (this.options.activeInfoWindow) {
                marker.bindPopup(this.options.infoWindow.content, point.data);
            }

            this.markers.push(marker);
            marker.addTo(this.map);
        });
    }

    clickOnMarker(markerId) {
        const marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            marker[0].openPopup();
        }
    }

    getDirections(origin, destination, options, callback, onError) {
        const DirectionsService = require('./DirectionsService');

        const map = new MappyMap(this.domId, this.options.map);
        const directionsService = new DirectionsService(map);

        directionsService.getRoute(origin, destination, options, callback, onError);
    }
}

window.Map = Mappy;
