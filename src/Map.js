'use strict';

require('./style.css');
let objectAssign = require('object-assign');

class Map {
    constructor(domElement, apiKey, options) {
        this.domElement = domElement;
        this.apiKey = apiKey;
        this.setOptions(options);
        this.provider = '[No provider defined]';
    }

    setPoints(points) {
        this.points = points;
    }

    setOptions(options) {
        let defaultOptions = {
            map: {},
            marker: {},
            markerCluster: {},
            infoWindow: {}
        };

        this.options = objectAssign(defaultOptions, options);
    }

    render() {
        console.error(this.provider + ' has no render method implemented');
    }

    load() {
        console.error(this.provider + ' has no load method implemented');
    }

    clickOnMarker() {
        console.error(this.provider + ' has no clickOnMarker method implemented');
    }
}

module.exports = Map;
