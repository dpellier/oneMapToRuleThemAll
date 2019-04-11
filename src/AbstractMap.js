'use strict';

require('./style.css');
const objectAssign = require('object-assign');
const dom = require('./utils/dom');

class AbstractMap {
    constructor(domSelector, apiKey, locale, options, plugins, customWindow) {
        this.domElement = dom.isHTMLElement(domSelector) ? domSelector : document.querySelector(domSelector);
        this.domId = this.domElement.id || '';
        this.apiKey = apiKey;
        this.locale = locale || 'en';
        this.setOptions(options);
        this.plugins = plugins || {};
        this.provider = '[No provider defined]';
        this.window = customWindow || window;
    }

    setPoints(points) {
        if (Object.prototype.toString.call(points) === '[object Array]') {
            this.points = points;
        } else {
            this.points = [points];
        }
    }

    setOptions(options) {
        let defaultOptions = {
            map: {},
            marker: {},
            markerCluster: {},
            infoWindow: {},
            loadParams: {}
        };

        this.options = objectAssign(defaultOptions, options);
    }

    render() {
        console.error(this.provider + ' has no render method implemented');
    }

    load() {
        console.error(this.provider + ' has no load method implemented');
    }

    setBounds() {
        console.error(this.provider + ' has no setBounds method implemented');
    }

    setIconOnMarker() {
        console.error(this.provider + ' has no setIconOnMarker method implemented');
    }

    focusOnMarker() {
        console.error(this.provider + ' has no focusOnMarker method implemented');
    }

    clickOnMarker() {
        console.error(this.provider + ' has no clickOnMarker method implemented');
    }

    getDirections() {
        console.error(this.provider + ' has no getDirections method implemented');
    }

    setCenter() {
        console.error(this.provider + ' has no setCenter method implemented');
    }

    setZoom() {
        console.error(this.provider + ' has no setZoom method implemented');
    }

    addMarkers() {
        console.error(this.provider + ' has no addMarkers method implemented');
    }
}

module.exports = AbstractMap;
