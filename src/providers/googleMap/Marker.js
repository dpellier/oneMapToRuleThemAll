'use strict';

let isDefined = require('simple-js-validator').isDefined;
let isTrue = require('simple-js-validator').isTrue;
let isAFunction = require('../../utils/type').isAFunction;
let isAString = require('../../utils/type').isAString;
let objectAssign = require('object-assign');

class Marker extends google.maps.Marker {
    constructor(map, point, options) {
        let markerOptions = buildMarkerOptions(point, map, options);
        super(markerOptions);
        this.id = point.id;
        this.defineLabel(options, point);
        this.addOnDragEndEventListener(markerOptions, options);
    }

    defineLabel(options, point) {
        let label = options.label;
        if (true === isDefined(label)) {
            if (true === isAFunction(label)) {
                this.setLabel(label(point));
            } else if (true === isAString(label) || true === isAMarkerLabel(label)) {
                this.setLabel(label);
            }
        }
    }

    addOnDragEndEventListener(marker, options) {
        if (true === isTrue(marker.draggable) && true === isDefined(options.onDragEnd)) {
            google.maps.event.addListener(this, 'dragend', (event) => {
                options.onDragEnd(event.latLng.lat(), event.latLng.lng());
            });
        }
    }

}

function buildMarkerOptions(point, map, options) {
    let marker = {
        position: new google.maps.LatLng(point.latitude, point.longitude),
        map: map,
        draggable: options.draggable || false
    };

    if (true === isDefined(options.icon)) {
        objectAssign(marker, {
            icon: options.icon
        });
    }
    return marker;
}

function isAMarkerLabel(label) {
    // use duck typing heuristic
    return true === isDefined(label.color) ||
        true === isDefined(label.fontFamily) ||
        true === isDefined(label.fontSize) ||
        true === isDefined(label.fontWeight) ||
        true === isDefined(label.text);
}

module.exports = Marker;
