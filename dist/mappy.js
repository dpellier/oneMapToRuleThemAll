/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Mappy Map
	 * API Documentation: http://leafletjs.com/reference.html
	 */

	/*jshint -W079 */

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Map = __webpack_require__(1);
	/* jshint +W079 */

	var domUtils = __webpack_require__(7);
	var loaderUtils = __webpack_require__(9);

	var MappyMap = undefined;
	var Marker = undefined;

	var Mappy = (function (_Map) {
	    _inherits(Mappy, _Map);

	    function Mappy() {
	        _classCallCheck(this, Mappy);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _get(Object.getPrototypeOf(Mappy.prototype), 'constructor', this).apply(this, args);

	        this.provider = 'Mappy';
	        this.markers = [];
	    }

	    _createClass(Mappy, [{
	        key: 'render',
	        value: function render(callback) {
	            this.map = new MappyMap(this.domId, this.options.map);
	            this.markers = [];

	            if (this.plugins.clusterer && this.options.activeCluster) {
	                this.markerClusterer = L.markerClusterGroup(this.options.markerCluster);
	                this.map.addLayer(this.markerClusterer);
	            }

	            this.addMarkers(this.points);

	            this.setBounds();

	            if (callback) {
	                callback();
	            }
	        }
	    }, {
	        key: 'load',
	        value: function load(callback, loadingMask) {
	            var _this = this;

	            if (window.L && window.L.Mappy) {
	                callback();
	                return;
	            }

	            if (loadingMask) {
	                callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
	            }

	            domUtils.addResources(document.body, [domUtils.createScript('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.js'), domUtils.createStyle('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.css')], function () {
	                var resources = [domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/Mappy/L.Mappy.js'), domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/Mappy/L.Mappy.css')];

	                if (_this.plugins.clusterer) {
	                    resources.push(domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/plugins/mappy/leaflet.markercluster.js'));
	                    resources.push(domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/plugins/mappy/MarkerCluster.Default.css'));
	                    resources.push(domUtils.createStyle('//d11lbkprc85eyb.cloudfront.net/plugins/mappy/MarkerCluster.css'));
	                }

	                domUtils.addResources(document.body, resources, function () {
	                    MappyMap = __webpack_require__(22);
	                    Marker = __webpack_require__(23);

	                    callback();
	                });
	            });
	        }
	    }, {
	        key: 'setBounds',
	        value: function setBounds() {
	            this.map.fitBounds(this.markers.map(function (marker) {
	                return marker.getLatLng();
	            }));
	        }
	    }, {
	        key: 'addMarkers',
	        value: function addMarkers(points) {
	            var _this2 = this;

	            points.forEach(function (point) {
	                var marker = new Marker(point, _this2.options.marker);

	                if (_this2.options.activeInfoWindow) {
	                    marker.bindPopup(_this2.options.infoWindow.content, point.data);
	                }

	                _this2.markers.push(marker);

	                if (_this2.plugins.clusterer && _this2.options.activeCluster) {
	                    _this2.markerClusterer.addLayer(marker);
	                } else {
	                    marker.addTo(_this2.map);
	                }
	            });
	        }
	    }, {
	        key: 'clickOnMarker',
	        value: function clickOnMarker(markerId) {
	            var _this3 = this;

	            var markers = this.markers.filter(function (marker) {
	                return marker.id.toString() === markerId.toString();
	            });

	            if (markers.length) {
	                (function () {
	                    var marker = markers[0];

	                    if (_this3.options.activeCluster) {
	                        _this3.markerClusterer.zoomToShowLayer(marker, function () {
	                            marker.fire('click');
	                        });
	                    } else {
	                        marker.fire('click');
	                    }
	                })();
	            }
	        }
	    }, {
	        key: 'getDirections',
	        value: function getDirections(origin, destination, options, callback, onError) {
	            var DirectionsService = __webpack_require__(25);

	            var map = new MappyMap(this.domId, this.options.map);
	            var directionsService = new DirectionsService(map);

	            directionsService.getRoute(origin, destination, options, callback, onError);
	        }
	    }]);

	    return Mappy;
	})(Map);

	window.Map = Mappy;
	window.OneMap = Mappy;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	__webpack_require__(2);
	var objectAssign = __webpack_require__(6);

	var Map = (function () {
	    function Map(domSelector, apiKey, locale, options, plugins) {
	        _classCallCheck(this, Map);

	        this.domElement = document.querySelector(domSelector);
	        this.domId = this.domElement.id || '';
	        this.apiKey = apiKey;
	        this.locale = locale || 'en';
	        this.setOptions(options);
	        this.plugins = plugins || {};
	        this.provider = '[No provider defined]';
	    }

	    _createClass(Map, [{
	        key: 'setPoints',
	        value: function setPoints(points) {
	            if (Object.prototype.toString.call(points) === '[object Array]') {
	                this.points = points;
	            } else {
	                this.points = [points];
	            }
	        }
	    }, {
	        key: 'setOptions',
	        value: function setOptions(options) {
	            var defaultOptions = {
	                map: {},
	                marker: {},
	                markerCluster: {},
	                infoWindow: {},
	                loadParams: {}
	            };

	            this.options = objectAssign(defaultOptions, options);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            console.error(this.provider + ' has no render method implemented');
	        }
	    }, {
	        key: 'load',
	        value: function load() {
	            console.error(this.provider + ' has no load method implemented');
	        }
	    }, {
	        key: 'setBounds',
	        value: function setBounds() {
	            console.error(this.provider + ' has no setBounds method implemented');
	        }
	    }, {
	        key: 'setIconOnMarker',
	        value: function setIconOnMarker() {
	            console.error(this.provider + ' has no setIconOnMarker method implemented');
	        }
	    }, {
	        key: 'focusOnMarker',
	        value: function focusOnMarker() {
	            console.error(this.provider + ' has no focusOnMarker method implemented');
	        }
	    }, {
	        key: 'clickOnMarker',
	        value: function clickOnMarker() {
	            console.error(this.provider + ' has no clickOnMarker method implemented');
	        }
	    }, {
	        key: 'getDirections',
	        value: function getDirections() {
	            console.error(this.provider + ' has no getDirections method implemented');
	        }
	    }, {
	        key: 'setCenter',
	        value: function setCenter() {
	            console.error(this.provider + ' has no setCenter method implemented');
	        }
	    }, {
	        key: 'setZoom',
	        value: function setZoom() {
	            console.error(this.provider + ' has no setZoom method implemented');
	        }
	    }, {
	        key: 'addMarkers',
	        value: function addMarkers() {
	            console.error(this.provider + ' has no addMarkers method implemented');
	        }
	    }]);

	    return Map;
	})();

	module.exports = Map;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, ".one-map-to-rule-them-all__spinner {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    content: '';\n    width: 50px;\n    height: 50px;\n    margin: auto;\n    padding: 50px 0 0 50px;\n    background-color: #333;\n\n    border-radius: 100%;\n    animation: scaleout 1.0s infinite ease-in-out;\n}\n\n@keyframes scaleout {\n    0% {\n        transform: scale(0.0);\n    } 100% {\n          transform: scale(1.0);\n          opacity: 0;\n      }\n}\n", ""]);

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function ownEnumerableKeys(obj) {
		var keys = Object.getOwnPropertyNames(obj);

		if (Object.getOwnPropertySymbols) {
			keys = keys.concat(Object.getOwnPropertySymbols(obj));
		}

		return keys.filter(function (key) {
			return propIsEnumerable.call(obj, key);
		});
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = ownEnumerableKeys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ieUtils = __webpack_require__(8);

	module.exports = {
	    addScript: function addScript(domElement, src) {
	        domElement.appendChild(this.createScript(src));
	    },

	    addStyle: function addStyle(domElement, href) {
	        domElement.appendChild(this.createStyle(href));
	    },

	    addResources: function addResources(domElement, resources, callback) {
	        var nbLoaded = 0;

	        if (resources.length === 0) {
	            callback();
	        }

	        resources.forEach(function (resource) {
	            ieUtils.addLoadListener(resource, function () {
	                nbLoaded++;

	                if (nbLoaded === resources.length) {
	                    callback();
	                }
	            });

	            domElement.appendChild(resource);
	        });
	    },

	    createScript: function createScript(src) {
	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.src = src;
	        script.async = true;

	        return script;
	    },

	    createStyle: function createStyle(href) {
	        var style = document.createElement('link');
	        style.rel = 'stylesheet';
	        style.href = href;

	        return style;
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    'delete': function _delete(obj, key) {
	        try {
	            delete obj[key];
	        } catch (e) {
	            obj[key] = undefined;
	        }
	    },
	    addEventListener: function addEventListener(domElement, event, callback, useCapture) {
	        if (domElement.addEventListener) {
	            domElement.addEventListener(event, callback, useCapture);
	        } else {
	            domElement.attachEvent('on' + event, callback);
	        }
	    },
	    addLoadListener: function addLoadListener(resource, callback) {
	        resource.onreadystatechange = function () {
	            if (this.readyState === 'complete') {
	                callback();
	            }
	        };
	        resource.onload = callback;
	    }
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var defaultLoaderClass = 'one-map-to-rule-them-all__spinner';

	module.exports = {
	    addLoader: function addLoader(domElement, loadingMask, callbackToWrap) {
	        var loader = document.createElement('div');

	        if (typeof loadingMask === 'string') {
	            loader.className = loadingMask;
	        } else {
	            loader.className = defaultLoaderClass;
	        }

	        domElement.appendChild(loader);

	        return function () {
	            domElement.removeChild(loader);
	            callbackToWrap();
	        };
	    }
	};

/***/ },
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);

	var Map = (function (_L$Mappy$Map) {
	    _inherits(Map, _L$Mappy$Map);

	    function Map(domElement, options) {
	        _classCallCheck(this, Map);

	        var defaultOptions = {
	            logoControl: {
	                dir: '//d11lbkprc85eyb.cloudfront.net/Mappy/images/'
	            }
	        };

	        _get(Object.getPrototypeOf(Map.prototype), 'constructor', this).call(this, domElement, objectAssign({}, defaultOptions, options));

	        L.Mappy.setLocale(this.locale || 'en_GB');
	        L.Mappy.setClientId(options.clientId);
	    }

	    return Map;
	})(L.Mappy.Map);

	module.exports = Map;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Icon = __webpack_require__(24);

	var Marker = (function (_L$Marker) {
	    _inherits(Marker, _L$Marker);

	    function Marker(point, options) {
	        _classCallCheck(this, Marker);

	        _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, [point.latitude, point.longitude], options);

	        if (options.icon && typeof options.icon.options.html === 'function') {
	            var icon = new Icon(point, options.icon.options);
	            this.setIcon(icon);
	        }

	        this.id = point.id;
	    }

	    _createClass(Marker, [{
	        key: 'bindPopup',
	        value: function bindPopup(content, data) {
	            var _this = this;

	            _get(Object.getPrototypeOf(Marker.prototype), 'bindPopup', this).call(this);

	            this.on({
	                click: function click() {
	                    var popup = _this.getPopup();

	                    if (!popup.getContent()) {
	                        if (typeof content === 'function') {
	                            popup.setContent(content(data));
	                        } else {
	                            popup.setContent(content);
	                        }
	                    }
	                }
	            });
	        }
	    }]);

	    return Marker;
	})(L.Marker);

	module.exports = Marker;

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Icon = (function (_L$DivIcon) {
	    _inherits(Icon, _L$DivIcon);

	    function Icon(point, options) {
	        _classCallCheck(this, Icon);

	        _get(Object.getPrototypeOf(Icon.prototype), 'constructor', this).call(this, Object.assign({}, options, {
	            html: options.html(point)
	        }));
	    }

	    return Icon;
	})(L.DivIcon);

	module.exports = Icon;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var objectAssign = __webpack_require__(6);

	function geocode(address, callback) {
	    L.Mappy.Services.geocode(address, function (res) {
	        callback(res[0].Point.coordinates.split(',').reverse());
	    }, function () {});
	}

	function geocodes(origin, destination, callback) {
	    var asyncCalls = 2;
	    var res = {};

	    function end() {
	        if (Object.keys(res).length === asyncCalls) {
	            callback([res.origin, res.destination]);
	        }
	    }

	    geocode(origin, function (coordinates) {
	        res.origin = coordinates;
	        end();
	    });

	    geocode(destination, function (coordinates) {
	        res.destination = coordinates;
	        end();
	    });
	}

	var DirectionsService = (function () {
	    function DirectionsService(map) {
	        _classCallCheck(this, DirectionsService);

	        this.map = map;

	        this.defaultRouteOptions = {
	            vehicle: L.Mappy.Vehicles.comcar
	        };
	    }

	    _createClass(DirectionsService, [{
	        key: 'getRoute',
	        value: function getRoute(origin, destination, options, callback, onError) {
	            var _this = this;

	            var opts = objectAssign({}, this.defaultRouteOptions, options);

	            geocodes(origin, destination, function (coordinates) {
	                L.Mappy.Services.route(coordinates, opts, function (result) {
	                    _this.map.fitBounds(coordinates);

	                    L.Mappy.route(result.routes).addTo(_this.map);
	                    callback(result.routes.route[0]);
	                }, function (err) {
	                    if (onError) {
	                        onError(err);
	                    }
	                });
	            });
	        }
	    }]);

	    return DirectionsService;
	})();

	module.exports = DirectionsService;

/***/ }
/******/ ]);