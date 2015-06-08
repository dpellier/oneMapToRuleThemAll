'use strict';

require('./style.css');

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
        this.options = options || {};
    }

    render() {
        console.error(this.provider + ' has no render method implemented');
    }

    load() {
        console.error(this.provider + ' has no load method implemented');
    }
}

module.exports = Map;
