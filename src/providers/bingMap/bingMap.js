'use strict';

module.exports = {
    render: render,
    defineMarker: defineMarker,
    loadScript: loadScript
};

/**
 * Render the map with a list of given location
 * @param domElement - DOM Element where the map will be appended
 * @param points - List of points to draw
 * @param mapKey - Bing Map API Key
 */
function render(domElement, points, mapKey) {
    var map = new Microsoft.Maps.Map(domElement, {credentials: mapKey});

    if (points.length > 1) {

        var locations = points.map(function (point) {
            var loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
            var pin = new Microsoft.Maps.Pushpin(loc);
            map.entities.push(pin);

            return loc;
        });

        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(locations);
        map.setView({bounds: viewBoundaries});

    } else {

        var loc = new Microsoft.Maps.Location(points[0].latitude, points[0].longitude);
        var pin = new Microsoft.Maps.Pushpin(loc);

        map.entities.push(pin);
        map.setView({center: loc, zoom: 10});
    }


}

/**
 * TODO
 */
function defineMarker() {

}

/**
 * Load the Bing Map resource
 * @param domElement - DOM Element where the resources will be appended
 * @param callback - function called after all resources are loaded
 */
function loadScript(domElement, callback) {
    // Add a global callback function to be called when bing script finish loading
    window._bingCallbackOnLoad = function() {

        // Remove callback to keep global clean
        delete window._bingCallbackOnLoad;
        callback();
    };

    var script = document.createElement('script');
    script.setAttribute('src', 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onScriptLoad=_bingCallbackOnLoad');
    script.setAttribute('type', 'text/javascript');
    domElement.appendChild(script);
}
