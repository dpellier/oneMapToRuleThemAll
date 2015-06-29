'use strict';

class DirectionsService extends google.maps.DirectionsService {
    constructor(...args) {
        super(...args);
    }

    getRoute(origin, destination, callback) {
        var request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log('directions:');
                console.log(result);
                callback(result);
            }
        });
    }

    getRouteWithMap(map, origin, destination, callback) {
        this.getRoute(origin, destination, (result) => {
            var display = new google.maps.DirectionsRenderer();

            display.setDirections(result);
            display.setMap(map);

            callback(result.routes[0].legs[0].steps);
        });
    }
}

module.exports = DirectionsService;
