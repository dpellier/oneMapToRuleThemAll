'use strict';

class BaiduMap extends BMap.Map {
    constructor(domElement, options) {
        super(domElement, options);

        // Default centering
        this.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        // Option like enableScrollWheelZoom must be set using the setter method
        for (let opt in options) {
            if (typeof this[opt] === 'function') {
                this[opt](options[opt]);
            }
        }
    }
}

module.exports = BaiduMap;
