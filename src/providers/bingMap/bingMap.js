'use strict';

var Map = require('../../Map');

class BingMap extends Map {
    constructor(...args) {
        super(...args);
        this.provider = 'Bing Map';
    }

    render(loadingMask) {
        // TODO loadingMask

        var map = new Microsoft.Maps.Map(this.domElement, {credentials: this.apiKey});

        if (this.points.length > 1) {

            var locations = this.points.map(function (point) {
                var loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
                var pin = new Microsoft.Maps.Pushpin(loc);
                map.entities.push(pin);

                return loc;
            });

            var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(locations);
            map.setView({bounds: viewBoundaries});

        } else {

            var loc = new Microsoft.Maps.Location(this.points[0].latitude, this.points[0].longitude);
            var pin = new Microsoft.Maps.Pushpin(loc);

            map.entities.push(pin);
            map.setView({center: loc, zoom: 10});
        }
    }

    loadFiles(callback) {
        // Add a global callback function to be called when bing script finish loading
        window._bingCallbackOnLoad = function() {

            // Remove callback to keep global clean
            delete window._bingCallbackOnLoad;
            callback();
        };

        var script = document.createElement('script');
        script.setAttribute('src', 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onScriptLoad=_bingCallbackOnLoad');
        script.setAttribute('type', 'text/javascript');
        this.domElement.appendChild(script);
    }
}

window.Map = BingMap;
