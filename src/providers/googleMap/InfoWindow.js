'use strict';

let objectAssign = require('object-assign');

class InfoWindow extends google.maps.InfoWindow {
    constructor(options) {
        super(objectAssign({}, options, {content: ''}));

        this._content = options.content;
    }

    build(data) {
        if (typeof this._content === 'string') {
            return this._content;
        }

        if (typeof this._content === 'function') {
            return this._content(data);
        }

        console.error('Info Window content must be a string or a function that return a string');
    }

    open(data, ...args) {
        super.setContent(this.build(data));
        super.open(...args);
    }
}

module.exports = InfoWindow;
