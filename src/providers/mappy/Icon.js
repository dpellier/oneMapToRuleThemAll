'use strict';

class Icon extends L.DivIcon {
    constructor(point, options) {
        super(Object.assign({}, options, {
            html: options.html(point)
        }));
    }
}

module.exports = Icon;
