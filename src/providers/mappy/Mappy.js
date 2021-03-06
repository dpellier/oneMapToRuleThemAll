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

        if (this.plugins.clusterer && this.options.activeCluster) {
            this.markerClusterer = L.markerClusterGroup(this.options.markerCluster);
            this.map.addLayer(this.markerClusterer);
        }

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
            domUtils.createScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.js'),
            domUtils.createStyle('//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.css')
        ], () => {
            const resources = [
                domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/Mappy/5.4.1/L.Mappy.js'),
                domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/Mappy/5.4.1/L.Mappy.css')
            ];

            if (this.plugins.clusterer) {
                resources.push(domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/plugins/mappy/5.4.1/leaflet.markercluster.js'));
                resources.push(domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/plugins/mappy/5.4.1/MarkerCluster.Default.css'));
                resources.push(domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/plugins/mappy/5.4.1/MarkerCluster.css'));
            }

            domUtils.addResources(document.body, resources, () => {
                MappyMap = require('./Map');
                Marker = require('./Marker');

                callback();
            });
        });
    }

    setZoom (level) {
        if (this.map) {
            this.map.setZoom(level);
        }
    }

    setBounds() {
        this.map.fitBounds(this.markers.map((marker) => {
            return marker.getLatLng();
        }));

        // Prevent zoomlevel too high when one marker
        if (this.markers.length === 1) {
            this.setZoom(14);
        }
    }

    addMarkers(points) {
        points.forEach((point) => {
            const marker = new Marker(point, this.options.marker);

            if (this.options.activeInfoWindow) {
                marker.bindPopup(this.options.infoWindow.content, point.data);
            }

            this.markers.push(marker);

            if (this.plugins.clusterer && this.options.activeCluster) {
                this.markerClusterer.addLayer(marker);
            } else {
                marker.addTo(this.map);
            }
        });
    }

    // Use focusOnMarker instead, this one is for retro compat
    clickOnMarker(markerId) {
        this.focusOnMarker(markerId);
    }

    focusOnMarker(markerId) {
        const markers = this.markers.filter((marker) => {
            return marker.id.toString() === markerId.toString();
        });

        if (markers.length) {
            const marker = markers[0];

            if (this.options.activeCluster) {
                this.markerClusterer.zoomToShowLayer(marker, () => {
                    marker.fire('click');
                });
            } else {
                marker.fire('click');
            }
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
window.OneMap = Mappy;
