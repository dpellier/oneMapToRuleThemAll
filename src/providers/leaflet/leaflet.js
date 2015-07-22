'use strict';

var Map = require('../../Map');
var domUtils = require('../../utils/dom');
var loaderUtils = require('../../utils/loader');

// TODO see if change leaflet to a service or use default map tile provider
class Leaflet extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Leaflet';
    }

    render(tileProvider) {
        let map = L.map(this.domElement).setView([51.505, -0.09], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'dpellier.c61a9bf4',
            accessToken: this.apiKey
        }).addTo(map);

        let marker = L.marker([51.5, -0.09]).addTo(map);
    }

    load(callback, loadingMask) {

        if (loadingMask) {
            callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
        }

        domUtils.addResources(this.domElement, [
            domUtils.createScript('http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js'),
            domUtils.createStyle('http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css')
        ], callback);
    }
}

function createMarker(map, latitude, longitude) {
    return new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map
    });
}

window.Map = Leaflet;
