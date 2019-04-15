'use strict';

let ieUtils = require('./ie');
let isAString = require('./type').isAString;
let isDefined = require('simple-js-validator').isDefined;

module.exports = {
    addScript: function (domElement, src) {
        domElement.appendChild(this.createScript(src));
    },

    addStyle: function (domElement, href) {
        domElement.appendChild(this.createStyle(href));
    },

    addResources: function (domElement, resources, callback) {
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

    createScript: function (src) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;

        return script;
    },

    createStyle: function (href) {
        let style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = href;

        return style;
    },

    isHTMLElement: function (obj) {
        return obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    },

    extractTextAndCssClasses: function (str) {
        let div = document.createElement('div');
        div.innerHTML = str;
        let textContent = div.textContent || div.innerText || '';
        let classes = '';
        if (isDefined(div.firstChild)) {
            classes = div.firstChild.className;
        }
        return {textContent: textContent, classes: classes};
    },

    // use a memoized version of the function as il would be silly to repeat the operation
    getStyleFromCss: memoize((cssClass) => {
        const div = document.createElement('div');
        div.className = cssClass;
        document.body.appendChild(div);
        let style = window.getComputedStyle(div);
        let result = {
            top: extractPx(style.top),
            left: extractPx(style.left)
        };
        document.body.removeChild(div);
        return result;
    })
};

function extractPx(str) {
    if (true === isAString(str)) {
        const pxValue = str.replace('px', '').replace('"', '');
        const pxNumber = parseInt(pxValue);
        return isFinite(pxNumber) ? pxNumber : 0;
    } else {
        return 0;
    }
}

function memoize(func) {
    const cache = {};
    return (arg) => {
        if (arg in cache) {
            return cache[arg];
        } else {
            try {
                let result = func(arg);
                cache[arg] = result;
                return result;
            } catch (e) {
                console.log(e);
                return null;
            }
        }
    }
}
