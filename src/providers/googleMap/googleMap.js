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

        // Create a marker for each point
        this.addMarkers(this.points);

        // Center the map
        this.setBounds();
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

        domUtils.addScript(this.domElement, '//maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey + '&language=' + this.locale);
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

    focusOnMarker(markerId, showInfoWindow = false, pan = false, zoom = 0) {
        markerId = markerId.toString();

        let marker = this.markers.filter((marker) => {
            return marker.id.toString() === markerId;
        });

        if (marker.length) {
            if (pan) {
                this.map.panTo(marker[0].position);

                if (showInfoWindow) {
                    // We trigger the info window only after the pan has finished
                    google.maps.event.addListenerOnce(this.map, 'idle', function() {
                        google.maps.event.trigger(marker[0], 'click');
                    });
                }
            }
            else if (showInfoWindow) {
                google.maps.event.trigger(marker[0], 'click');
            }

            if (zoom > 0) {
                this.map.setZoom(zoom);
            }
        }
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

    addMarkers(points) {
        if (Object.prototype.toString.call(points) !== '[object Array]') {
            points = [points];
        }
        let markers = [];

        let options = {};
        let activeInfoWindow;

        for(let i = 0; i < points.length; i++) {
            options = Object.assign({}, this.options.marker, points[i].options ? points[i].options : {});
            activeInfoWindow = points[i].activeInfoWindow !== undefined ? points[i].activeInfoWindow : this.options.activeInfoWindow;

            points[i].options = options;
            points[i].activeInfoWindow = activeInfoWindow;

            const marker = new Marker(this.map, points[i], options);

            // Bind the info window on marker click if the option is set
            if (activeInfoWindow) {
                google.maps.event.addListener(marker, 'click', () => {
                    this.infoWindow.open(points[i].data, this.map, marker);
                    this.map.panTo(marker.getPosition());
                });
            }

            this.markers.push(marker);

            if (this.map && this.plugins.clusterer && this.options.activeCluster) {
                this.markerClusterer.addMarker(marker);
            }
        }

        return markers;
    }
}

window.Map = GoogleMap;
