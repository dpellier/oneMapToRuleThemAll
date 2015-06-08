'use strict';

var objectAssign = require('object-assign');

class InfoWindow extends google.maps.InfoWindow {
    constructor(options) {
        super(objectAssign({}, options, getContent(options.content)));
    }

    setContent(content) {
        super.setContent(getContent(content))
    }
}

function getContent(content) {
    if (typeof content === 'string') {
        return content;
    }

    if (typeof content === 'function') {
        return content();
    }

    console.error('Info Window content must be a string or a function that return a string');
}

module.exports = InfoWindow;
