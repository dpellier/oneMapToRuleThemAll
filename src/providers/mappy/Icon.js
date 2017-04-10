'use strict';
let objectAssign = require('object-assign');

class Icon extends L.DivIcon {
    constructor(point, options) {
        super(objectAssign({}, options, {
            html: options.html(point)
        }));
    }
}

module.exports = Icon;
