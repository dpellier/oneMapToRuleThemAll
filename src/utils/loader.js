'use strict';

const defaultLoaderClass = 'one-map-to-rule-them-all__spinner';

module.exports = {
    addLoader: function(domElement, loadingMask, callbackToWrap) {
        let loader = document.createElement('div');

        if (typeof loadingMask === 'string') {
            loader.className = loadingMask;
        } else {
            loader.className = defaultLoaderClass;
        }

        domElement.appendChild(loader);

        return function() {
            domElement.removeChild(loader);
            callbackToWrap();
        };
    }
};
