'use strict';

let ieUtils = require('./ie');

module.exports = {
    addScript: function(domElement, src) {
        domElement.appendChild(this.createScript(src));
    },

    addStyle: function(domElement, href) {
        domElement.appendChild(this.createStyle(href));
    },

    addResources: function(domElement, resources, callback) {
        let nbLoaded = 0;

        if (resources.length === 0) {
            callback();
        }

        resources.forEach((resource) => {
            ieUtils.addLoadListener(resource, () => {
                nbLoaded++;

                if (nbLoaded === resources.length) {
                    callback();
                }
            });

            domElement.appendChild(resource);
        });
    },

    createScript: function(src) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;

        return script;
    },

    createStyle: function(href) {
        let style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = href;

        return style;
    }
};
