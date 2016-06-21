'use strict';

class Marker extends L.Marker {
    constructor(point, options) {
        super([point.latitude, point.longitude], options);

        this.id = point.id;
    }

    bindPopup(content, data) {
        super.bindPopup();

        this.on({
            click: () => {
                const popup = this.getPopup();

                if (!popup.getContent()) {
                    if (typeof content === 'function') {
                        popup.setContent(content(data));
                    } else {
                        popup.setContent(content);
                    }
                }
            }
        });
    }
}

module.exports = Marker;
