'use strict';

let isDefined = require('simple-js-validator').isDefined;
let isTrue = require('simple-js-validator').isTrue;
let isAFunction = require('../../utils/type').isAFunction;
let isAString = require('../../utils/type').isAString;
let objectAssign = require('object-assign');
let MarkerWithLabel = require('@google/markerwithlabel');
let dom = require('../../utils/dom');

const DEFAULT_MARKER_LABEL_CSS_CLASS = 'lf-map-marker-label';

class Marker extends MarkerWithLabel {
    constructor(map, point, options) {
        let markerOptions = buildMarkerOptions(point, map, options);
        super(markerOptions);
        this.id = point.id;
        this.defineLabel(options);
        this.addOnDragEndEventListener(markerOptions, options);
    }

    defineLabel(options) {
        // if possible use the native type defined in google maps api
        // @see https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
        if (true === isAMarkerLabel(options.label)) {
            this.setLabel(options.label);
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
    let markerOptions = {
        position: new google.maps.LatLng(point.latitude, point.longitude),
        map: map,
        draggable: options.draggable || false
    };

    if (true === isDefined(options.icon)) {
        let iconOptions = objectAssign({}, options.icon);
        objectAssign(markerOptions, {
            icon: iconOptions
        });
    }
    // NOTE:
    // this is a HACK to preserve backward compatibility.
    // There is an implicit contract here: the css class for the label is inside an html fragment
    // given in options.label.
    // We should be more explicit: options.label should contain only the actual text to display
    // and we should add an options.labelCssClass field
    let textAndCssForLabel = getTextAndCssForLabel(options.label, point);
    if (true === isDefined(textAndCssForLabel)){
        objectAssign(markerOptions,{
            labelContent: textAndCssForLabel.textContent,
        });
        if (true === isAString(textAndCssForLabel.classes) && textAndCssForLabel.classes.trim().length > 0) {
            const labelClass = textAndCssForLabel.classes;
            objectAssign(markerOptions,{
                labelClass: labelClass
            });
            const style = dom.getStyleFromCss(labelClass);
            objectAssign(markerOptions, {labelAnchor: new google.maps.Point(-style.left + 1, -style.top)});
        }
    }
    if (false === isDefined(markerOptions.labelClass)) {
        objectAssign(markerOptions, {
            labelClass: DEFAULT_MARKER_LABEL_CSS_CLASS
        });
    }
    return markerOptions;
}

function getTextAndCssForLabel(label, point) {
    let result = null;
    if (true === isDefined(label)) {
        let labelValue = getLabelValue(label, point);
        if (true === isAString(labelValue)){
            result = dom.extractTextAndCssClasses(labelValue);
        }
    }
    return result;
}

function getLabelValue(label, point) {
    if (true === isAFunction(label)) {
        return label(point);
    } else {
        return label;
    }
}


function isAMarkerLabel(label) {
    // use duck typing heuristic
    return true === isDefined(label) && (
        true === isDefined(label.color) ||
        true === isDefined(label.fontFamily) ||
        true === isDefined(label.fontSize) ||
        true === isDefined(label.fontWeight) ||
        true === isDefined(label.text)
    );
}

module.exports = Marker;
