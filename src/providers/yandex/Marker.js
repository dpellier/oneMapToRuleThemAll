'use strict';

class Marker extends ymaps.Placemark {
    constructor(point, options, infoWindow) {
        let properties = {};

        if (options.properties) {
            if (options.properties.iconContent) {
                properties.iconContent = options.properties.iconContent(point);
            }

            if (options.properties.balloonContent) {
                properties.balloonContent = options.properties.balloonContent(point.data);
            }
        }

        if (!infoWindow) {
            options.options.hasBalloon = false;
        }

        super([point.latitude, point.longitude], properties, options.options);

        this.id = point.id;
    }
}

module.exports = Marker;
