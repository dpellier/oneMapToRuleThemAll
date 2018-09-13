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
    },

    isHTMLElement: function(obj) {
        return obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    },

    extractTextAndCssClasses: function (str) {
        let div = document.createElement('div');
        div.innerHTML = str;
        let textContent = div.textContent || div.innerText || "";
        let classes = [];
        try {
            if (isObject(div.firstChild) && isObject(div.firstChild.classList)) {
                for (let i = 0; i < div.firstChild.classList.length; i++) {
                    classes.push(div.firstChild.classList.item(i));
                }
            }
        } catch (e) {
            // may fail with Cannot read property 'classList' of null
            console.warn(e);
        }
        return {textContent: textContent, classes: classes};
    }
};

function isObject(element) {
    return typeof element === 'object';
}
