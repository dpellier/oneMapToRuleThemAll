'use strict';

let Label = require('./Label');

class MarkerCluster extends L.MarkerClusterGroup {
    constructor(options) {
        if (options.icon) {
            options.iconCreateFunction = function(cluster) {
                let content = '<div class="' + options.labelClass + '"><span>' + cluster.getChildCount() + '</span></div>';
                return new Label(content, options.icon);
            }
        }

        super(options);
    }
}

module.exports = MarkerCluster;
