'use strict';

// TODO create an UI to bundle only required provider
var googleMap = require('./providers/googleMap/googleMap');
var bingMap = require('./providers/bingMap/bingMap');
var leaflet = require('./providers/leaflet/leaflet');

var Map = function(domElement, apiKey, config) {
    this.points = [];
    this.domElement = domElement;
    this.apiKey = config.apiKey;
    this.options = config.options || {};
};

Map.prototype.render = function(displayLoader) {
    if (displayLoader) {
        // TODO add mask loader on map dom element until all is loaded
    }

    this.provider.loadScript(this.domElement, function() {
        this.provider.render(this.domElement, this.points, this.apiKey, this.options);
    }.bind(this), this.mapKey);
};

Map.prototype.setPoints = function(points) {
    // TODO check format and return detailed error if incorrect + auto cast array
    this.points = points;
};







Map.prototype.setInfoWindow = function(dom) {

};

Map.prototype.setMarker = function() {

};

//module.exports = Map;
window.Map = Map;
