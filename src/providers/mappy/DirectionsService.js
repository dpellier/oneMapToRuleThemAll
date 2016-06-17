'use strict';

const objectAssign = require('object-assign');

function geocode(address, callback) {
    L.Mappy.Services.geocode(address, (res) => {
        callback(res[0].Point.coordinates.split(',').reverse());
    }, () => {});
}

function geocodes(origin, destination, callback) {
    const asyncCalls = 2;
    const res = {};

    function end() {
        if (Object.keys(res).length === asyncCalls) {
            callback([res.origin, res.destination]);
        }
    }

    geocode(origin, (coordinates) => {
        res.origin = coordinates;
        end();
    });

    geocode(destination, (coordinates) => {
        res.destination = coordinates;
        end();
    });
}

class DirectionsService {
    constructor(map) {
        this.map = map;

        this.defaultRouteOptions = {
            vehicle: L.Mappy.Vehicles.comcar
        };
    }

    getRoute(origin, destination, options, callback, onError) {
        const opts = objectAssign({}, this.defaultRouteOptions, options);

        geocodes(origin, destination, (coordinates) => {
            L.Mappy.Services.route(coordinates, opts,
                (result) => {
                    this.map.fitBounds(coordinates);

                    L.Mappy.route(result.routes).addTo(this.map);
                    callback(result.routes.route[0]);
                },
                (err) => {
                    if (onError) {
                        onError(err);
                    }
                }
            );
        });
    }
}

module.exports = DirectionsService;
