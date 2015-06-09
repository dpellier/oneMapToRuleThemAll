'use strict';

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let MarkerClusterer = require('markerclustererplus');


class GoogleMap extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Google Map';
    }

    render() {
        // Require google object here cause they're not loaded before
        let InfoWindow = require('./InfoWindow');
        let Marker = require('./Marker');

        // Init the map
        let map = new google.maps.Map(this.domElement, this.options.map);
        let bounds = new google.maps.LatLngBounds();

        let infoWindow;
        let markers = [];

        // Init the info window is the option is set
        if (this.options.infoWindow.active) {
            infoWindow = new InfoWindow(this.options.infoWindow);
        }

        // Create a marker for each point
        this.points.forEach((point) => {
            let marker = new Marker(map, point, this.options.marker);
            bounds.extend(marker.position);
            markers.push(marker);

            // Bind the info window on marker click if the option is set
            if (this.options.infoWindow.active) {
                google.maps.event.addListener(marker, 'click', () => {
                    infoWindow.open(point.data, map, marker);
                });
            }
        });

        // Center the map
        map.fitBounds(bounds);

        // Init the clustering if the option is set
        if (this.options.markerCluster.active) {
            new MarkerClusterer(map, markers, this.options.markerCluster);
        }
    }

    load(callback, loadingMask) {
        window._googleMapCallbackOnLoad = function() {
            delete window._googleMapCallbackOnLoad;
            callback();
        };

        if (loadingMask) {
            window._googleMapCallbackOnLoad = loaderUtils.addLoader(this.domElement, loadingMask, window._googleMapCallbackOnLoad);
        }

        domUtils.addScript(this.domElement, 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey);
    }
}

window.Map = GoogleMap;
