'use strict';

const Icon = require('./Icon');

class Marker extends L.Marker {
    constructor(point, options) {
        super([point.latitude, point.longitude], options);

        if (options.icon && typeof options.icon.options.html === 'function') {
            const icon = new Icon(point, options.icon);
            this.setIcon(icon);
        }

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
