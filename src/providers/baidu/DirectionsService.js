'use strict';

class DirectionsService {
    constructor(map, panelSelector) {
        this.map = map;
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
        this.panelElement = document.querySelector(panelSelector);
    }

    getRoute(origin, destination, callback) {
        let driving = new BMap.DrivingRoute(this.map, {
            renderOptions: {
                map: this.map,
                autoViewport: true,
                selectFirstResult: true,
                panel: this.panelElement
            },
            onSearchComplete: function(results) {
                if (driving.getStatus() === BMAP_STATUS_SUCCESS) {
                    callback(results);
                }
            }
        });

        driving.search(origin, destination);
    }
}

module.exports = DirectionsService;
