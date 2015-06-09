'use strict';

var objectAssign = require('object-assign');

class InfoBox extends Microsoft.Maps.Infobox {
    constructor(location, options) {
        super(location, objectAssign({visible: false}, options, {description: ''}));//getDescription(options.description)));

        this._descriptionConfig = options.description;
    }

    build(data) {
        if (typeof this._descriptionConfig === 'string') {
            return this._descriptionConfig;
        }

        if (typeof this._descriptionConfig === 'function') {
            return this._descriptionConfig(data) || ' ';
        }

        console.error('Info Box description must be a string or a function that return a string');
    }

    display(location, data) {
        super.setLocation(location);

        super.setOptions({
            visible: true,
            description: this.build(data)
        });
    }
}

module.exports = InfoBox;
