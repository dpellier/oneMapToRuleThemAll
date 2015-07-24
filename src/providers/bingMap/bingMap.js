'use strict';

/**
 * Bing Map v7
 * API Documentation: https://msdn.microsoft.com/en-us/library/dd877180.aspx
 */

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let objectAssign = require('object-assign');
let InfoBox;
let Marker;

class BingMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = 'Bing';
        this.markers = [];
    }

    render() {
        // Init the map
        let map = new Microsoft.Maps.Map(this.domElement, objectAssign({
            credentials: this.apiKey
        }, this.options.map));

        let infoBox = {};
        let dataLayer = new Microsoft.Maps.EntityCollection();
        map.entities.push(dataLayer);

        let bounds = [];

        // Init the info window is the option is set
        if (this.options.infoWindow) {
            infoBox = new InfoBox(new Microsoft.Maps.Location(0, 0), this.options.infoWindow);
            map.entities.push(infoBox);
        }

        // Create a marker for each point
        this.points.forEach((point) => {
            //let loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
            //let marker = new Microsoft.Maps.Pushpin(loc, this.options.marker);
            let marker = new Marker(point, this.options.marker);
            dataLayer.push(marker);

            this.markers.push(marker);

            // Bind the info window on pin click if the option is set
            if (this.options.infoWindow.active) {
                Microsoft.Maps.Events.addHandler(marker, 'click', (e) => {
                    infoBox.display(e.target.getLocation(), point.data);
                    map.setView({center: marker.getLocation()});
                });
            }

            bounds.push(marker.getLocation());
        });

        // Center the map
        if (bounds.length === 1) {
            map.setView({center: bounds[0], zoom: 10});
        } else {
            map.setView({bounds: Microsoft.Maps.LocationRect.fromLocations(bounds)});
        }

        //function addPin(point, options) {
        //    let loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
        //    let pin = new Microsoft.Maps.Pushpin(loc, options.marker);
        //
        //    dataLayer.push(pin);
        //
        //    // Bind the info window on pin click if the option is set
        //    if (options.infoWindow.active) {
        //        Microsoft.Maps.Events.addHandler(pin, 'click', (e) => {
        //            infoBox.display(e.target.getLocation(), point.data);
        //            map.setView({center: pin.getLocation()});
        //        });
        //    }
        //
        //    return pin.getLocation();
        //}

        //if (this.points.length > 1) {
        //    // Create a pin for each point
        //    let locations = this.points.map((point) => {
        //        return addPin(point, this.options);
        //    });
        //
        //    // Center the map
        //    let viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(locations);
        //    map.setView({bounds: viewBoundaries});
        //
        //} else {
        //    let loc = addPin(this.points[0], this.options);
        //
        //    // Center the map
        //    map.setView({center: loc, zoom: 10});
        //}
    }

    load(callback, loadingMask) {
        window._bingCallbackOnLoad = function() {
            // Require microsoft object here cause they're not loaded before
            InfoBox = require('./InfoBox');
            Marker = require('./Marker');

            delete window._bingCallbackOnLoad;
            callback();
        };

        if (loadingMask) {
            window._bingCallbackOnLoad = loaderUtils.addLoader(this.domElement, loadingMask, window._bingCallbackOnLoad);
        }

        domUtils.addScript(this.domElement, 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onScriptLoad=_bingCallbackOnLoad');
    }

    clickOnMarker(markerId) {
        //markerId = markerId.toString();
        //let marker = this.markers.filter((marker) => {
        //    return marker.id.toString() === markerId;
        //});
        //
        //if (marker.length) {
        //    // If the marker is inside a cluster, we have to zoom to it before triggering the click
        //    if (this.options.markerCluster.active && !marker[0].getMap()) {
        //        this.map.setZoom(17);
        //        this.map.panTo(marker[0].position);
        //
        //        // We trigger the info window only after the pan has finished
        //        google.maps.event.addListenerOnce(this.map, 'idle', function() {
        //            new google.maps.event.trigger(marker[0], 'click');
        //        });
        //
        //    } else {
        //        new google.maps.event.trigger(marker[0], 'click');
        //    }
        //}
    }
}

window.Map = BingMap;
