'use strict';

let objectAssign = require('object-assign');

class Map extends ymaps.Map {
    constructor(domElement, options) {
        let defaultOptions = {
            center: [0, 0],
            zoom: 10
        };

        super(domElement, objectAssign({}, defaultOptions, options));
    }
}

module.exports = Map;
