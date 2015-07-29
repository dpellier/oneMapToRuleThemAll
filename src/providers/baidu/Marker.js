'use strict';

class Marker extends BMap.Marker {
    constructor(point, options, label) {
        super(new BMap.Point(point.longitude, point.latitude), options);

        if (label) {
            let content = '';

            if (typeof label.content === 'function') {
                content = label.content(point);
            } else {
                content = label.content || '';
            }

            let markerLabel = new BMap.Label(content, label.options);
            markerLabel.setStyle(label.style);

            this.setLabel(markerLabel);
        }

        this.id = point.id;
    }
}

module.exports = Marker;
