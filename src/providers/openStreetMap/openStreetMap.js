"use strict";

/**
 * Open Street Map
 * API Documentation: http://openlayers.org/en/latest/doc/
 */

/*jshint -W079 */
let Map = require("../../Map");
/* jshint +W079 */

let domUtils = require("../../utils/dom");
let _ = require("lodash");

class OpenStreetMap extends Map {
    constructor(...args) {
        super(...args);

        this.provider = "OpenStreetMap";
        this.view = null;
    }

    load(callback) {
        if (window.ol) {
            if (callback) callback();
        } else {
            domUtils.addResources(
                this.domElement,
                [
                    domUtils.createStyle(
                        "//openlayers.org/en/v4.6.5/css/ol.css"
                    ),
                    domUtils.createScript(
                        "//cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"
                    ),
                    domUtils.createScript(
                        "//openlayers.org/en/v4.6.5/build/ol.js"
                    )
                ],
                () => {
                    callback();
                }
            );
        }
    }

    render(callback) {
        this.markers = [];

        const mapParams = {};
        if (this.options.map.center) {
            mapParams.center = ol.proj.fromLonLat(this.options.map.center);
        }

        if (this.options.map.zoom) {
            mapParams.zoom = this.options.map.zoom;
        }

        this.view = new ol.View(mapParams);

        this.markersSource = new ol.source.Vector({
            features: this.markers
        });

        this.markersLayer = new ol.layer.Vector({
            source: this.markersSource
        });

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                this.markersLayer
            ],
            target: this.domElement,
            controls: ol.control.defaults({
                attributionOptions: {
                    collapsible: false
                }
            }),
            view: this.view
        });

        this.addMarkers(this.points);

        // Fit bounds if more than one point
        if (this.points.length > 1) {
            this.setBounds();
        }

        if (callback) callback();
    }

    setBounds() {
        if (this.map) {
            this.map.getView().fit(this.markersSource.getExtent());
        }
    }

    setZoom(level) {
        if (this.map) {
            this.view.setZoom(level);
        }
    }

    setCenter(lat, lng) {
        if (this.map) {
            var size = this.map.getSize();
            this.view.centerOn(ol.proj.fromLonLat([lng, lat]), size, [
                size[0] / 2,
                size[1] / 2
            ]);
        }
    }

    setIconOnMarker(markerId, icon, zIndex = 1) {
        markerId = markerId.toString();

        let marker = this.markers.filter(marker => {
            return marker.getId() === markerId;
        });

        if (marker.length && icon) {
            marker[0].setStyle(this.getStyle(icon, zIndex));
        }
    }

    focusOnMarker(markerId) {
        markerId = markerId.toString();

        let marker = this.markers.filter(marker => {
            return marker.getId() === markerId;
        });

        if (marker.length) {
            const coords = ol.proj.transform(
                marker[0].getGeometry().getCoordinates(),
                "EPSG:3857",
                "EPSG:4326"
            );
            this.setCenter(coords[1], coords[0]);
            this.setZoom(14);
        }
    }

    addMarkers(points) {
        if (Object.prototype.toString.call(points) !== "[object Array]") {
            points = [points];
        }

        for (let i = 0; i < points.length; i++) {
            const iconFeature = new ol.Feature({
                type: "icon",
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat([
                        points[i].longitude,
                        points[i].latitude
                    ])
                )
            });

            iconFeature.setStyle(
                this.getStyle(
                    _.get(
                        points[i],
                        "options.icon.url",
                        this.options.marker.icon.url
                    )
                )
            );
            iconFeature.setId(points[i].id);
            iconFeature.id = points[i].id;
            this.markers.push(iconFeature);
        }

        this.markersSource.clear();
        this.markersSource.addFeatures(this.markers);

        return this.markers;
    }

    getStyle(url, index = 1) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                src: url
            }),
            zIndex: index
        });
    }
}

window.Map = OpenStreetMap;
window.OneMap = OpenStreetMap;
