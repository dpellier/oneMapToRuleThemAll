'use strict';

let objectAssign = require('object-assign');

module.exports = {
    init: function(map, markers, options) {
        let opts = objectAssign({
            gridSize: 70
        }, options);

        return new ViaMichelin.Api.Map.MarkerClusterer(objectAssign(opts, {
            map: map,
            markers: markers
        }));
    }
};
