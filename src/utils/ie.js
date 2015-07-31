'use strict';

module.exports = {
    delete: function(obj, key) {
        try {
            delete obj[key];
        } catch(e) {
            obj[key] = undefined;
        }
    },
    addEventListener: function(domElement, event, callback, useCapture) {
        if (domElement.addEventListener) {
            domElement.addEventListener(event, callback, useCapture);
        } else {
            domElement.attachEvent('on' + event, callback);
        }
    },
    addLoadListener: function(resource, callback) {
        resource.onreadystatechange = function() {
            if (this.readyState === 'complete') {
                callback();
            }
        };
        resource.onload = callback;
    }
};
