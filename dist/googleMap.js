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
	 * Google Map v3
	 * API Documentation: https://developers.google.com/maps/documentation/javascript/
	 */

	/*jshint -W079 */

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Map = __webpack_require__(1);
	/* jshint +W079 */

	var domUtils = __webpack_require__(7);
	var ieUtils = __webpack_require__(8);
	var loaderUtils = __webpack_require__(9);
	var InfoWindow = undefined;
	var Marker = undefined;

	var GoogleMap = (function (_Map) {
	    _inherits(GoogleMap, _Map);

	    function GoogleMap() {
	        _classCallCheck(this, GoogleMap);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _get(Object.getPrototypeOf(GoogleMap.prototype), 'constructor', this).apply(this, args);

	        this.provider = 'Google';
	        this.map = null;
	        this.markers = [];
	        this.infoWindow = null;
	        this.markerClusterer = null;
	    }

	    _createClass(GoogleMap, [{
	        key: 'render',
	        value: function render() {
	            var _this = this;

	            if (this.plugins.infobox) {
	                InfoWindow = __webpack_require__(17);
	            } else {
	                InfoWindow = __webpack_require__(18);
	            }

	            // Init the map
	            this.map = new google.maps.Map(this.domElement, this.options.map);
	            var bounds = new google.maps.LatLngBounds();

	            // Init the info window is the option is set
	            if (this.options.activeInfoWindow) {
	                this.infoWindow = new InfoWindow(this.options.infoWindow);
	            }

	            // Create a marker for each point
	            this.points.forEach(function (point) {
	                var marker = new Marker(_this.map, point, _this.options.marker);
	                bounds.extend(marker.position);

	                _this.markers.push(marker);

	                // Bind the info window on marker click if the option is set
	                if (_this.options.activeInfoWindow) {
	                    google.maps.event.addListener(marker, 'click', function () {
	                        _this.infoWindow.open(point.data, _this.map, marker);
	                    });
	                }
	            });

	            if (this.options.map.zoom) {
	                // This is needed to set the zoom after fitBounds,
	                google.maps.event.addListenerOnce(this.map, 'bounds_changed', function () {
	                    _this.map.setZoom(Math.min(_this.options.map.zoom, _this.map.getZoom()));
	                });
	            }

	            // Center the map
	            this.map.fitBounds(bounds);

	            // Init the clustering if the option is set
	            if (this.plugins.clusterer && this.options.activeCluster) {
	                this.markerClusterer = new MarkerClusterer(this.map, this.markers, this.options.markerCluster);

	                google.maps.event.addListener(this.markerClusterer, 'clusteringend', function (clusterer) {
	                    clusterer.getClusters().forEach(function (cluster) {
	                        var markers = cluster.getMarkers();

	                        if (markers.length > 1) {
	                            markers.forEach(function (marker) {
	                                marker.hideLabel();
	                            });
	                        }
	                    });
	                });
	            }
	        }
	    }, {
	        key: 'load',
	        value: function load(callback, loadingMask) {
	            if (window.google && window.google.maps) {
	                callback();
	                return;
	            }

	            var domElement = this.domElement;
	            var plugins = this.plugins;

	            window._googleMapCallbackOnLoad = function () {
	                // Require google object here cause they're not loaded before
	                Marker = __webpack_require__(19);

	                ieUtils['delete'](window, '_googleMapCallbackOnLoad');

	                var resources = [];

	                if (plugins.clusterer) {
	                    resources.push(domUtils.createScript('//d11lbkprc85eyb.cloudfront.net/markerclusterer.min.js'));
	                }

	                if (plugins.infobox) {
	                    resources.push(domUtils.createScript('//google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js'));
	                }

	                domUtils.addResources(domElement, resources, callback);
	            };

	            if (loadingMask) {
	                callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
	            }

	            domUtils.addScript(this.domElement, '//maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey + '&language=' + this.locale);
	        }
	    }, {
	        key: 'clickOnMarker',
	        value: function clickOnMarker(markerId) {
	            markerId = markerId.toString();
	            var marker = this.markers.filter(function (marker) {
	                return marker.id.toString() === markerId;
	            });

	            if (marker.length) {
	                // If the marker is inside a cluster, we have to zoom to it before triggering the click
	                if (this.options.activeCluster && !marker[0].getMap()) {
	                    this.map.setZoom(17);
	                    this.map.panTo(marker[0].position);

	                    // We trigger the info window only after the pan has finished
	                    google.maps.event.addListenerOnce(this.map, 'idle', function () {
	                        google.maps.event.trigger(marker[0], 'click');
	                    });
	                } else {
	                    google.maps.event.trigger(marker[0], 'click');
	                }
	            }
	        }
	    }, {
	        key: 'getDirections',
	        value: function getDirections(origin, destination, options, callback, onError) {
	            var DirectionsService = __webpack_require__(21);

	            var map = new google.maps.Map(this.domElement, this.options.map);
	            var directionsService = new DirectionsService(map, options.panelSelector);

	            delete options.panelSelector;

	            directionsService.getRoute(origin, destination, options, callback, onError);
	        }
	    }]);

	    return GoogleMap;
	})(Map);

	window.Map = GoogleMap;

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
	                infoWindow: {}
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
	        key: 'clickOnMarker',
	        value: function clickOnMarker() {
	            console.error(this.provider + ' has no clickOnMarker method implemented');
	        }
	    }, {
	        key: 'getDirections',
	        value: function getDirections() {
	            console.error(this.provider + ' has no getDirections method implemented');
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var objectAssign = __webpack_require__(6);

	/* global InfoBox:true */

	var InfoBoxPlugin = (function () {
	    function InfoBoxPlugin(options) {
	        _classCallCheck(this, InfoBoxPlugin);

	        var infoBox = new InfoBox(objectAssign({}, options, { content: '' }));

	        this._content = options.content;
	        this.box = infoBox;

	        if (options.onDomReady) {
	            google.maps.event.addListener(this.box, 'domready', options.onDomReady);
	        }
	    }

	    _createClass(InfoBoxPlugin, [{
	        key: 'build',
	        value: function build(data) {
	            if (typeof this._content === 'string') {
	                return this._content;
	            }

	            if (typeof this._content === 'function') {
	                return this._content(data);
	            }

	            console.error('Info Box content must be a string or a function that return a string');
	        }
	    }, {
	        key: 'open',
	        value: function open(data) {
	            var _box;

	            this.box.setContent(this.build(data));

	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            (_box = this.box).open.apply(_box, args);
	        }
	    }]);

	    return InfoBoxPlugin;
	})();

	module.exports = InfoBoxPlugin;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);

	var InfoWindow = (function (_google$maps$InfoWindow) {
	    _inherits(InfoWindow, _google$maps$InfoWindow);

	    function InfoWindow(options) {
	        _classCallCheck(this, InfoWindow);

	        _get(Object.getPrototypeOf(InfoWindow.prototype), 'constructor', this).call(this, objectAssign({}, options, { content: '' }));
	        this._content = options.content;

	        if (options.onDomReady) {
	            google.maps.event.addListener(this, 'domready', options.onDomReady);
	        }
	    }

	    _createClass(InfoWindow, [{
	        key: 'build',
	        value: function build(data) {
	            if (typeof this._content === 'string') {
	                return this._content;
	            }

	            if (typeof this._content === 'function') {
	                return this._content(data);
	            }

	            console.error('Info Window content must be a string or a function that return a string');
	        }
	    }, {
	        key: 'open',
	        value: function open(data) {
	            _get(Object.getPrototypeOf(InfoWindow.prototype), 'setContent', this).call(this, this.build(data));

	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            _get(Object.getPrototypeOf(InfoWindow.prototype), 'open', this).apply(this, args);
	        }
	    }]);

	    return InfoWindow;
	})(google.maps.InfoWindow);

	module.exports = InfoWindow;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);
	var Label = __webpack_require__(20);

	var Marker = (function (_google$maps$Marker) {
	    _inherits(Marker, _google$maps$Marker);

	    function Marker(map, point, options) {
	        _classCallCheck(this, Marker);

	        var marker = {
	            position: new google.maps.LatLng(point.latitude, point.longitude),
	            map: map
	        };

	        if (options.icon) {
	            objectAssign(marker, {
	                icon: options.icon
	            });
	        }

	        _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, marker);
	        this.id = point.id;

	        if (options.label) {
	            this.label = new Label({
	                map: map,
	                position: this.getPosition()
	            }, point, options.label);
	        }
	    }

	    _createClass(Marker, [{
	        key: 'hideLabel',
	        value: function hideLabel() {
	            if (this.label) {
	                this.label.hide();
	            }
	        }
	    }]);

	    return Marker;
	})(google.maps.Marker);

	module.exports = Marker;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function getCustomContent(content, point) {
	    if (typeof content === 'function') {
	        return content(point);
	    }
	    return content || '';
	}

	var Label = (function (_google$maps$OverlayView) {
	    _inherits(Label, _google$maps$OverlayView);

	    function Label(config, point, content) {
	        _classCallCheck(this, Label);

	        _get(Object.getPrototypeOf(Label.prototype), 'constructor', this).call(this);
	        this.setValues(config);
	        this._customContent = getCustomContent(content, point);

	        this._div = document.createElement('div');
	        this.hide();
	    }

	    _createClass(Label, [{
	        key: 'onAdd',
	        value: function onAdd() {
	            var pane = this.getPanes().floatPane;
	            pane.appendChild(this._div);
	        }
	    }, {
	        key: 'onRemove',
	        value: function onRemove() {
	            this._div.parentNode.removeChild(this.div_);
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {
	            var projection = this.getProjection();
	            var position = projection.fromLatLngToDivPixel(this.get('position'));

	            this._div.style.left = position.x + 'px';
	            this._div.style.top = position.y + 'px';
	            this._div.style.display = 'block';

	            this._div.innerHTML = this._customContent;
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this._div.style.cssText = 'position: absolute; display: none';
	        }
	    }]);

	    return Label;
	})(google.maps.OverlayView);

	module.exports = Label;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);

	var DirectionsService = (function (_google$maps$DirectionsService) {
	    _inherits(DirectionsService, _google$maps$DirectionsService);

	    function DirectionsService(map, panelSelector) {
	        _classCallCheck(this, DirectionsService);

	        _get(Object.getPrototypeOf(DirectionsService.prototype), 'constructor', this).call(this);

	        this.display = new google.maps.DirectionsRenderer();
	        this.display.setMap(map);

	        if (panelSelector) {
	            var panel = document.querySelector(panelSelector);
	            panel.innerHTML = '';

	            this.display.setPanel(panel);
	        }
	    }

	    _createClass(DirectionsService, [{
	        key: 'getRoute',
	        value: function getRoute(origin, destination, options, callback, onError) {
	            var _this = this;

	            callback = callback || function () {};

	            this.route(buildRequest(origin, destination, options), function (result, status) {
	                if (status === google.maps.DirectionsStatus.OK) {
	                    _this.display.setDirections(result);

	                    callback(result.routes[0]);
	                } else {
	                    onError('Unable to calculate a driving itinerary for the destination: ' + destination);
	                }
	            });
	        }
	    }]);

	    return DirectionsService;
	})(google.maps.DirectionsService);

	module.exports = DirectionsService;

	function buildRequest(origin, destination, options) {
	    return objectAssign({
	        travelMode: google.maps.TravelMode.DRIVING
	    }, options || {}, {
	        origin: origin,
	        destination: options.region ? options.region + ' ' + destination : destination
	    });
	}

/***/ }
/******/ ]);