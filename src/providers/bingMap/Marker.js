'use strict';

class Marker extends Microsoft.Maps.Pushpin {
    constructor(point, options) {
        let location = new Microsoft.Maps.Location(point.latitude, point.longitude);
        super(location, options);
    }
}

module.exports = Marker;
