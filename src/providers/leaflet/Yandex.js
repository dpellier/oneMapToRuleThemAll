'use strict';

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let DirectionsService;
let Marker;
let MarkerCluster;
let TileLayer;

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
        this.map = new L.Map(this.domElement, this.options.map);
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


        // TODO bind click on map toggle off all popup ?
    }

    load(callback, loadingMask, clustered, routing) {
        let resources = [
            domUtils.createScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js'),
            domUtils.createStyle('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css'),
            domUtils.createScript('//api-maps.yandex.ru/2.0/?load=package.map&lang=ru-RU')
        ];

        domUtils.addResources(this.domElement, resources, () => {
            Marker = require('./Marker');
            TileLayer = require('./TileLayer');

            let additionalResources = [];

            if (clustered) {
                additionalResources = additionalResources.concat([
                    domUtils.createScript('//cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/leaflet.markercluster.js'),
                    domUtils.createStyle('//cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.Default.css'),
                    domUtils.createStyle('//cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.css')
                ]);
            }

            //if (routing) {
            //    additionalResources = additionalResources.concat([
            //        domUtils.createScript('//d3djiwh30nkktw.cloudfront.net/leaflet-routing-machine.min.js'),
            //        domUtils.createStyle('//d3djiwh30nkktw.cloudfront.net/leaflet-routing-machine.css'),
            //        domUtils.createScript('//d3djiwh30nkktw.cloudfront.net/Control.Geocoder.js'),
            //        domUtils.createStyle('//d3djiwh30nkktw.cloudfront.net/Control.Geocoder.css')
            //    ]);
            //}

            domUtils.addResources(this.domElement, additionalResources, () => {
                if (clustered) {
                    MarkerCluster = require('./MarkerCluster');
                }

                callback();
            });
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

    getDirections(origin, destination, options, callback) {

        DirectionsService = require('./DirectionsService');

        if (!directionsService) {
            let map = new L.Map(this.domElement, this.options.map);
            map.addLayer(new TileLayer());

            directionsService = new DirectionsService(map, options.panelSelector);
        }

        //let map = new L.Map(this.domElement, this.options.map);
        //map.addLayer(new TileLayer());

        directionsService.getRoute(origin, destination, options, callback);



        //let map = new L.Map(this.domElement, this.options.map);
        //map.addLayer(new TileLayer());
        //
        //L.Routing.control({
        //    waypoints: [
        //        L.latLng(57.74, 11.94),
        //        L.latLng(57.6792, 11.949)
        //    ],
        //    routeWhileDragging: false,
        //    geocoder: L.Control.Geocoder.nominatim()
        //}).addTo(map);
    //    let DirectionsService = require('./DirectionsService');
    //
    //    if (!directionsService) {
    //        let map = new google.maps.Map(this.domElement, this.options.map);
    //        directionsService = new DirectionsService(map, options.panelSelector);
    //    }
    //
    //    delete options.panelSelector;
    //
    //    directionsService.getRoute(origin, destination, options, callback);
    }
}

window.Map = Yandex;
