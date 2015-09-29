'use strict';

/**
 * Google Map v3
 * API Documentation: https://developers.google.com/maps/documentation/javascript/
 */

/*jshint -W079 */
let Map = require('../../Map');
/* jshint +W079 */

let domUtils = require('../../utils/dom');
let ieUtils = require('../../utils/ie');
let loaderUtils = require('../../utils/loader');
let InfoWindow;
let Marker;

let directionsService;

class GoogleMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Google';
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.markerClusterer = null;
    }

    render() {
        if (this.plugins.infobox) {
            InfoWindow = require('./plugins/InfoBox');
        } else {
            InfoWindow = require('./InfoWindow');
        }

        // Init the map
        this.map = new google.maps.Map(this.domElement, this.options.map);
        let bounds = new google.maps.LatLngBounds();

        // Init the info window is the option is set
        if (this.options.activeInfoWindow) {
            this.infoWindow = new InfoWindow(this.options.infoWindow);
        }

        // Create a marker for each point
        this.points.forEach((point) => {
            let marker = new Marker(this.map, point, this.options.marker);
            bounds.extend(marker.position);

            this.markers.push(marker);

            // Bind the info window on marker click if the option is set
            if (this.options.activeInfoWindow) {
                google.maps.event.addListener(marker, 'click', () => {
                    this.infoWindow.open(point.data, this.map, marker);
                });
            }
        });

        if (this.options.map.zoom) {
            // This is needed to set the zoom after fitBounds,
            google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
                this.map.setZoom(Math.min(this.options.map.zoom, this.map.getZoom()));
            });
        }

        // Center the map
        this.map.fitBounds(bounds);

        // Init the clustering if the option is set
        if (this.plugins.clusterer && this.options.activeCluster) {
            this.markerClusterer = new MarkerClusterer(this.map, this.markers, this.options.markerCluster);

            google.maps.event.addListener(this.markerClusterer, 'clusteringend', function(clusterer) {
                clusterer.getClusters().forEach(function(cluster) {
                    let markers = cluster.getMarkers();

                    if (markers.length > 1) {
                        markers.forEach(function(marker) {
                            marker.hideLabel();
                        });
                    }
                });
            });
        }
    }

    load(callback, loadingMask) {
        if (window.google && window.google.maps) {
            callback();
            return;
        }

        let domElement = this.domElement;
        let plugins = this.plugins;

        window._googleMapCallbackOnLoad = function() {
            // Require google object here cause they're not loaded before
            Marker = require('./Marker');

            ieUtils.delete(window, '_googleMapCallbackOnLoad');

            let resources = [];

            if (plugins.clusterer) {
                resources.push(domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/markerclusterer.min.js'));
            }

            if (plugins.infobox) {
                resources.push(domUtils.createScript('//google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js'));
            }

            domUtils.addResources(domElement, resources, callback);
        };

        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addScript(this.domElement, '//maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey);
    }

    clickOnMarker(markerId) {
        markerId = markerId.toString();
        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            // If the marker is inside a cluster, we have to zoom to it before triggering the click
            if (this.options.activeCluster && !marker[0].getMap()) {
                this.map.setZoom(17);
                this.map.panTo(marker[0].position);

                // We trigger the info window only after the pan has finished
                google.maps.event.addListenerOnce(this.map, 'idle', function() {
                    google.maps.event.trigger(marker[0], 'click');
                });

            } else {
                google.maps.event.trigger(marker[0], 'click');
            }
        }
    }

    getDirections(origin, destination, options, callback) {
        let DirectionsService = require('./DirectionsService');

        if (!directionsService) {
            let map = new google.maps.Map(this.domElement, this.options.map);
            directionsService = new DirectionsService(map, options.panelSelector);
        }

        delete options.panelSelector;

        directionsService.getRoute(origin, destination, options, callback);
    }
}

window.Map = GoogleMap;
