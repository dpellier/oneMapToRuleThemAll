'use strict';

var Map = require('../../Map');
var domUtils = require('../../utils/dom');
var loaderUtils = require('../../utils/loader');
var objectAssign = require('object-assign');

class BingMap extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Bing Map';
    }

    render() {
        let map = new Microsoft.Maps.Map(this.domElement, objectAssign({
            credentials: this.apiKey
        }, this.options.map));

        if (this.points.length > 1) {

            let locations = this.points.map((point) => {
                var loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
                var pin = new Microsoft.Maps.Pushpin(loc, this.options.marker);
                map.entities.push(pin);

                return loc;
            });

            let viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(locations);
            map.setView({bounds: viewBoundaries});

        } else {

            let loc = new Microsoft.Maps.Location(this.points[0].latitude, this.points[0].longitude);
            let pin = new Microsoft.Maps.Pushpin(loc, this.options.marker);

            map.entities.push(pin);
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
