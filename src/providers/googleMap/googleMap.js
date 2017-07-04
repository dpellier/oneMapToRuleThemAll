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
let objectAssign = require('object-assign');
let InfoWindow;
let Marker;

class GoogleMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Google';
        this.map = null;
        this.markers = [];
        this.infoWindow = null;
        this.markerClusterers = [];
    }

    render(callback) {
        if (this.plugins.infobox) {
            InfoWindow = require('./plugins/InfoBox');
        } else {
            InfoWindow = require('./InfoWindow');
        }

        // Init the map
        this.map = new google.maps.Map(this.domElement, this.options.map);
        this.markers = [];

        // Init the info window is the option is set
        if (this.options.activeInfoWindow) {
            this.infoWindow = new InfoWindow(this.options.infoWindow);
        }

        if (this.options.map.zoom) {
            // This is needed to set the zoom after fitBounds,
            google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
                this.map.setZoom(Math.min(this.options.map.zoom, this.map.getZoom()));
            });
        }

        // Create a marker for each point
        this.addMarkers(this.points, 0);

        // Center the map
        this.setBounds();

        if (callback) {
            callback();
        }
    }

    load(callback, loadingMask) {
        if (window.google && window.google.maps) {
            callback();
            return;
        }

        let domElement = this.domElement;
        let plugins = this.plugins;

        this.window._googleMapCallbackOnLoad = function() {
            window.google = this.window.google;

            // Require google object here cause they're not loaded before
            Marker = require('./Marker');

            ieUtils.delete(this.window, '_googleMapCallbackOnLoad');

            let resources = [];

            if (plugins.clusterer) {
                resources.push(domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/markerclusterer.min.js'));
            }

            if (plugins.infobox) {
                resources.push(domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/plugins/googleMap/infobubble-compiled.js'));
            }

            domUtils.addResources(domElement, resources, callback);
        };

        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        let urlParams = Object.keys(this.options.loadParams).reduce((param, key) => {
            param += key + '=' + this.options.loadParams[key] + '&';
            return param;
        }, '?');

        urlParams += 'v=3.exp&callback=_googleMapCallbackOnLoad&language=' + this.locale;

        if (!this.options.loadParams.signature) {
            urlParams += '&key=' + this.apiKey;
        }

        domUtils.addScript(this.domElement, '//maps.googleapis.com/maps/api/js' + urlParams);
    }

    setBounds() {
        let bounds = new google.maps.LatLngBounds();
        this.markers.forEach((marker) => {
            bounds.extend(marker.position);
        });
        this.map.fitBounds(bounds);
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
        this.focusOnMarker(markerId, true, true, 0);
    }

    focusOnMarker(markerId, showInfoWindow = false, pan = false, zoom = 0) {
        markerId = markerId.toString();

        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            if (pan) {
                // If the marker is inside a cluster, we have to zoom to it before triggering the click
                if (this.options.activeCluster && !marker[0].getMap()) {
                    this.map.setZoom(17);
                }
                else if (zoom > 0) {
                    this.setZoom(zoom);
                }

                if (showInfoWindow && this.infoWindow) {
                    google.maps.event.trigger(marker[0], 'click');
                }
                else { // The pan is managed by the infowindow
                    this.map.panTo(marker[0].position);
                }
            }
            else if (showInfoWindow) {
                google.maps.event.trigger(marker[0], 'click');
            }
        }
    }

    getDirections(origin, destination, options, callback, onError) {
        let DirectionsService = require('./DirectionsService');

        let map = new google.maps.Map(this.domElement, this.options.map);
        let directionsService = new DirectionsService(map, options.panelSelector);

        delete options.panelSelector;

        directionsService.getRoute(origin, destination, options, callback, onError);
    }

    setCenter(lat, lng) {
        if (this.map) {
            this.map.setCenter({
                lat: lat,
                lng:lng
            });
        }
    }

    setZoom (level) {
        if (this.map) {
            this.map.setZoom(level);
        }
    }

    addMarkers(points, clusterIndex = null, clusterConfig = null) {
        if (Object.prototype.toString.call(points) !== '[object Array]') {
            points = [points];
        }

        if (!clusterConfig) {
            clusterConfig = this.options.markerCluster;
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

            const marker = new Marker(this.map, points[i], options);

            // Bind the info window on marker click if the option is set
            if (options.activeInfoWindow) {
                google.maps.event.addListener(marker, 'click', () => {
                    this.infoWindow.open(points[i].data, this.map, marker);
                });
            }
            else {
                google.maps.event.addListener(marker, 'click', () => {
                    this.map.panTo(marker.getPosition());
                });
            }

            markers.push(marker);
            this.markers.push(marker);
        }

        // If clustering is activated for those markers
        if (this.map && this.plugins.clusterer && this.options.activeCluster && clusterIndex !== null) {
            if (this.markerClusterers[clusterIndex]) {
                for(let i = 0; i < markers.length; i++) {
                    this.markerClusterers[clusterIndex].addMarker(markers[i]);
                }
            }
            else {
                let markerClusterer = new this.window.MarkerClusterer(this.map, markers, clusterConfig);
                this.markerClusterers.push(markerClusterer);

                google.maps.event.addListener(markerClusterer, 'clusteringend', function(clusterer) {
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

        return markers;
    }
}

window.Map = GoogleMap;
window.OneMap = GoogleMap;
