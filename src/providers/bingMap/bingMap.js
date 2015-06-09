'use strict';

let Map = require('../../Map');
let domUtils = require('../../utils/dom');
let loaderUtils = require('../../utils/loader');
let objectAssign = require('object-assign');

class BingMap extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Bing Map';
    }

    render() {
        // Require microsoft object here cause they're not loaded before
        let InfoBox = require('./InfoBox');

        // Init the map
        let map = new Microsoft.Maps.Map(this.domElement, objectAssign({
            credentials: this.apiKey
        }, this.options.map));

        let infoBox = {};
        let dataLayer = new Microsoft.Maps.EntityCollection();
        map.entities.push(dataLayer);

        // Init the info window is the option is set
        if (this.options.infoWindow) {
            infoBox = new InfoBox(new Microsoft.Maps.Location(0, 0), this.options.infoWindow);
            map.entities.push(infoBox);
        }

        function addPin(point, options) {
            let loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
            let pin = new Microsoft.Maps.Pushpin(loc, options.marker);

            dataLayer.push(pin);

            // Bind the info window on pin click if the option is set
            if (options.infoWindow.active) {
                Microsoft.Maps.Events.addHandler(pin, 'click', (e) => {
                    infoBox.display(e.target.getLocation(), point.data);
                    map.setView({center: pin.getLocation()});
                });
            }

            return pin.getLocation();
        }

        if (this.points.length > 1) {
            // Create a pin for each point
            let locations = this.points.map((point) => {
                return addPin(point, this.options);
            });

            // Center the map
            let viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(locations);
            map.setView({bounds: viewBoundaries});

        } else {
            let loc = addPin(this.points[0], this.options);

            // Center the map
            map.setView({center: loc, zoom: 10});
        }
    }

    load(callback, loadingMask) {
        window._bingCallbackOnLoad = function() {
            delete window._bingCallbackOnLoad;
            callback();
        };

        if (loadingMask) {
            window._bingCallbackOnLoad = loaderUtils.addLoader(this.domElement, loadingMask, window._bingCallbackOnLoad);
        }

        domUtils.addScript(this.domElement, 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onScriptLoad=_bingCallbackOnLoad');
    }
}

window.Map = BingMap;
