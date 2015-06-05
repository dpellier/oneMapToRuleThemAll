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

    var map = L.map(domElement).setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'dpellier.c61a9bf4',
        accessToken: mapKey
    }).addTo(map);

    var marker = L.marker([51.5, -0.09]).addTo(map);
}

/**
 * TODO
 */
function defineMarker() {

}

/**
 * Load the Leaflet resource
 * @param domElement - DOM Element where the resources will be appended
 * @param callback - function called after all resources are loaded
 */
function loadScript(domElement, callback) {

    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css';

    var script = document.createElement('script');
    script.setAttribute('src', 'http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js');
    script.setAttribute('type', 'text/javascript');
    script.async = true;

    var resources = [style, script];
    var nbLoaded = 0;

    resources.forEach(function(resource) {
        resource.addEventListener('load', function() {
            nbLoaded++;

            if (nbLoaded === resources.length) {
                callback();
            }
        }, false);

        domElement.appendChild(resource);
    });
}
