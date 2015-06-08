'use strict';

var objectAssign = require('object-assign');

class InfoBox extends Microsoft.Maps.Infobox {
    constructor(location, options) {
        super(location, objectAssign({visible: false}, options, getDescription(options.description)));
    }

    display(location, description) {
        this.setLocation(location);

        super.setOptions({
            visible: true,
            description: getDescription(description)
        });
    }
}

function getDescription(description) {
    if (typeof description === 'string') {
        return description;
    }

    if (typeof description === 'function') {
        return description();
    }

    console.error('Info Box description must be a string or a function that return a string');
}

module.exports = InfoBox;
