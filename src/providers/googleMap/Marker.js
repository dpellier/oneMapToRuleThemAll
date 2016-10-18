'use strict';

let objectAssign = require('object-assign');
let Label = require('./Label');

class Marker extends google.maps.Marker {
    constructor(map, point, options) {
        let marker = {
            position: new google.maps.LatLng(point.latitude, point.longitude),
            map: map,
            draggable: options.draggable || false
        };

        if (options.icon) {
            objectAssign(marker, {
                icon: options.icon
            });
        }

        super(marker);
        this.id = point.id;

        if (options.label) {
            this.label = new Label({
                map: map,
                position: this.getPosition()
            }, point, options.label);
        }

        if (marker.draggable) {
            google.maps.event.addListener(this, 'drag', (event) => {
                if (options.label) {
                    this.label.update(event.latLng);
                }
            });

            if (options.onDragEnd) {
                google.maps.event.addListener(this, 'dragend', (event) => {
                    options.onDragEnd(event.latLng.lat(), event.latLng.lng());
                });
            }
        }
    }

    hideLabel() {
        if (this.label) {
            this.label.hide();
        }
    }
}

module.exports = Marker;
