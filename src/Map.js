'use strict';

class Map {
    constructor(domElement, apiKey, options) {
        this.domElement = domElement;
        this.apiKey = apiKey;
        this.options = options || {};
        this.provider = '[No provider defined]';
    }

    setPoints(points) {
        this.points = points;
    }

    setOptions(options) {
        this.options = options;
    }

    render() {
        console.log(this.provider + ' has no render method implemented');
    }

    loadFiles() {
        console.log(this.provider + ' has no loadFiles method implemented');
    }
}

module.exports = Map;
