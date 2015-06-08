'use strict';

var Map = require('../../Map');
var domUtils = require('../../utils/dom');
var loaderUtils = require('../../utils/loader');

class GoogleMap extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Google Map';
    }

    render() {
        this.points = [this.points[0]];

        let map = new google.maps.Map(this.domElement, this.options.map);
        let bounds = new google.maps.LatLngBounds();

        this.points.forEach((point) => {
            let marker = createMarker(map, point.latitude, point.longitude, this.options.marker);
            bounds.extend(marker.position);
        });

        map.fitBounds(bounds);
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

function createMarker(map, latitude, longitude, options) {
    return new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        icon: options
    });
}

window.Map = GoogleMap;
