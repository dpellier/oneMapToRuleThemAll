'use strict';

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let MarkerClusterer = require('markerclustererplus');

class GoogleMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Google Map';
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.markerClusterer = null;
    }

    render() {
        // Require google object here cause they're not loaded before
        let InfoWindow = require('./InfoWindow');
        let Marker = require('./Marker');

        // Init the map
        this.map = new google.maps.Map(this.domElement, this.options.map);
        let bounds = new google.maps.LatLngBounds();

        // Init the info window is the option is set
        if (this.options.infoWindow.active) {
            this.infoWindow = new InfoWindow(this.options.infoWindow);
        }

        // Create a marker for each point
        this.points.forEach((point) => {
            let marker = new Marker(this.map, point, this.options.marker);
            bounds.extend(marker.position);

            this.markers.push(marker);

            // Bind the info window on marker click if the option is set
            if (this.options.infoWindow.active) {
                google.maps.event.addListener(marker, 'click', () => {
                    if (this.infoWindow.anchor && this.infoWindow.anchor.id === marker.id) {
                        this.infoWindow.close();
                    } else {
                        this.infoWindow.open(point.data, this.map, marker);
                    }
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
        if (this.options.markerCluster.active) {
            this.markerClusterer = new MarkerClusterer(this.map, this.markers, this.options.markerCluster);

            google.maps.event.addListener(this.markerClusterer, 'clusteringend', function(clusterer) {
                clusterer.getClusters().forEach(function(cluster) {
                    var markers = cluster.getMarkers();

                    if (markers.length > 1) {
                        markers.forEach(function(marker) {
                            marker.hideLabel();
                        });
                    }
                })
            });
        }
    }

    load(callback, loadingMask) {
        if (window.google && window.google.maps) {
            callback();
            return;
        }

        window._googleMapCallbackOnLoad = function() {
            delete window._googleMapCallbackOnLoad;
            callback();
        };

        if (loadingMask) {
            window._googleMapCallbackOnLoad = loaderUtils.addLoader(this.domElement, loadingMask, window._googleMapCallbackOnLoad);
        }

        domUtils.addScript(this.domElement, 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey);
    }

    clickOnMarker(markerId) {
        markerId = markerId.toString();
        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            // If the marker is inside a cluster, we have to zoom to it before triggering the click
            if (this.options.markerCluster.active && !marker[0].getMap()) {
                this.map.setZoom(17);
                this.map.panTo(marker[0].position);

                // We trigger the info window only after the pan has finished
                google.maps.event.addListenerOnce(this.map, 'idle', function() {
                    new google.maps.event.trigger(marker[0], 'click');
                });

            } else {
                new google.maps.event.trigger(marker[0], 'click');
            }
        }
    }

    getDirections(origin, destination, callback) {
        if (!this.directionsService) {
            let DirectionsService = require('./DirectionsService');
            this.directionsService = new DirectionsService();
        }

        var map = new google.maps.Map(this.domElement, this.options.map);

        this.directionsService.getRouteWithMap(map, origin, destination, callback);
    }
}

window.Map = GoogleMap;
