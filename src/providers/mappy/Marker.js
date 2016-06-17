'use strict';

class Marker extends L.Marker {
    constructor(point, options) {
        super([point.latitude, point.longitude], options);

        this.id = point.id;
    }

    bindPopup(content, data) {
        if (typeof content === 'string') {
            super.bindPopup(content);
            return;
        }

        if (typeof content === 'function') {
            super.bindPopup(content(data));
        }
    }
}

module.exports = Marker;
