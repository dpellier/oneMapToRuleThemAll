'use strict';

class MarkerClusterer {
    constructor(map, markers, options) {
        let clusterer = new PinClusterer(map);

        clusterer.setOptions({
            onClusterToMap: (center) => {
                if (isCluster(center)) {
                    center.setOptions(options);

                    // We hide all markers included in the cluster
                    clusterer._clusters.forEach((cluster) => {
                        if (JSON.stringify(cluster.center.location) === JSON.stringify(center.getLocation())) {
                            cluster.locations.forEach((location) => {
                                let matchingMarker = findByCoords(markers, location);

                                if (matchingMarker.length) {
                                    matchingMarker[0].setOptions({
                                        visible: false
                                    });
                                }
                            });
                        }
                    });

                } else {
                    // We hide the clusterer marker to use our own
                    center.setOptions({
                        visible: false
                    });

                    let matchingMarker = findByCoords(markers, center.getLocation());

                    if (matchingMarker.length) {
                        matchingMarker[0].setOptions({
                            visible: true
                        });
                    }
                }
            }
        });

        return clusterer;
    }
}

function isCluster(point) {
    return point.getTypeName() === 'pin_clusterer cluster';
}

function findByCoords(list, coords) {
    return list.filter((item) => {
        return item.latitude === coords.latitude && item.longitude === coords.longitude;
    });
}

module.exports = MarkerClusterer;
