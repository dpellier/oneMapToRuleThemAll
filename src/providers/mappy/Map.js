'use strict';

const objectAssign = require('object-assign');

class Map extends L.Mappy.Map {
    constructor(domElement, options) {
        const defaultOptions = {
            logoControl: {
                dir: '//d11lbkprc85eyb.cloudfront.net/Mappy/images/'
            }
        };

        super(domElement, objectAssign({}, defaultOptions, options));

        L.Mappy.setLocale(this.locale || 'en_GB');
        L.Mappy.setClientId(options.clientId);
    }
}

module.exports = Map;
