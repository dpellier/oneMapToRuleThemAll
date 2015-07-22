'use strict';

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let Marker;
let MarkerCluster;
let TileLayer;

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
        this.map = new L.Map(this.domElement, {center: new L.LatLng(67.6755, 33.936), zoom: 10, zoomAnimation: false });
        this.map.addLayer(new TileLayer());
        let bounds = L.latLngBounds([]);

        // Init the clustering if the option is set
        if (this.options.markerCluster.active) {
            this.cluster = new MarkerCluster(this.options.markerCluster);
            this.map.addLayer(this.cluster);
        }

        // Create a marker for each point
        this.points.forEach((point) => {
            let marker = new Marker(point, this.options.marker);
            this.markers.push(marker);

            // Bind the info window is the option is set
            if (this.options.infoWindow.active) {
                marker.bindPopup(L.popup(this.options.infoWindow).setContent(this.options.infoWindow.content(point.data)));
            }

            bounds.extend([point.latitude, point.longitude]);

            if (this.options.markerCluster.active) {
                this.cluster.addLayer(marker);
            } else {
                marker.addTo(this.map);
            }
        });

        // Center the map
        this.map.fitBounds(bounds);


        // TODO bind click on map toggle off all popup
    }

    load(callback, loadingMask, clustered) {
        let resources = [
            domUtils.createScript('http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js'),
            domUtils.createStyle('http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css'),
            domUtils.createScript('http://api-maps.yandex.ru/2.0/?load=package.map&lang=ru-RU')
        ];

        domUtils.addResources(this.domElement, resources, () => {
            Marker = require('./Marker');
            TileLayer = require('./TileLayer');

            if (clustered) {
                domUtils.addResources(this.domElement, [
                    domUtils.createScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/leaflet.markercluster.js'),
                    domUtils.createStyle('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.Default.css'),
                    domUtils.createStyle('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.css')
                ], () => {
                    MarkerCluster = require('./MarkerCluster');
                    callback();
                });
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
            marker[0].togglePopup();
        }
    }
}

window.Map = Yandex;
