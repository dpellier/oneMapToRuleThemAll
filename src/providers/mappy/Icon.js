'use strict';

class Icon extends L.DivIcon {
    constructor(point, options) {
        super({
            html: options.options.html(point)
        });
    }
}

module.exports = Icon;
