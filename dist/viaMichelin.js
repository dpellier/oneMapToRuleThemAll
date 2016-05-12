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
	 * ViaMichelin Map v2
	 * API Documentation: http://dev.viamichelin.fr/viamichelin-javascript-api.html
	 */

	/*jshint -W079 */

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Map = __webpack_require__(1);
	/* jshint +W079 */

	var domUtils = __webpack_require__(7);
	var loaderUtils = __webpack_require__(9);
	var DirectionsService = undefined;
	var Marker = undefined;
	var markerClusterer = undefined;

	var directionsService = undefined;
	var vmService = undefined;

	var ViaMichelinMap = (function (_Map) {
	    _inherits(ViaMichelinMap, _Map);

	    function ViaMichelinMap() {
	        _classCallCheck(this, ViaMichelinMap);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _get(Object.getPrototypeOf(ViaMichelinMap.prototype), 'constructor', this).apply(this, args);

	        this.provider = 'ViaMichelin';
	        this.map = null;
	        this.markers = [];
	        this.markerClusterers = [];
	        this.center = null;
	    }

	    _createClass(ViaMichelinMap, [{
	        key: 'render',
	        value: function render(callback) {
	            var _this = this;

	            var self = this;

	            vmService.mapInstance(this.domId, this.options.map, function (map) {
	                _this.map = map;

	                // Create a marker for each point
	                _this.addMarkers(self.points, 0);

	                var bounds = _this.getBounds();
	                _this.map.drawMap({ geoBoundaries: { no: { lon: bounds[0][1], lat: bounds[0][0] }, se: { lon: bounds[1][1], lat: bounds[1][0] } } }, 16);
	                _this.center = _this.map.getCenter();

	                if (callback) {
	                    callback();
	                }
	            });
	        }
	    }, {
	        key: 'load',
	        value: function load(callback, loadingMask) {
	            if (loadingMask) {
	                callback = loaderUtils.addLoader(this.domElement, loadingMask, callback);
	            }

	            if (window.VMLaunch) {
	                callback();
	            } else {
	                domUtils.addResources(this.domElement, [domUtils.createScript('//apijsv2.viamichelin.com/apijsv2/api/js?key=' + this.apiKey + '&lang=' + this.locale)], function () {
	                    Marker = __webpack_require__(22);
	                    markerClusterer = __webpack_require__(23);
	                    vmService = __webpack_require__(24);
	                    callback();
	                });
	            }
	        }
	    }, {
	        key: 'getBounds',
	        value: function getBounds() {
	            var bounds = [[0, 0], [0, 0]];

	            this.points.forEach(function (point) {
	                bounds = getLargestBounds(bounds, point);
	            });

	            return bounds;
	        }
	    }, {
	        key: 'setBounds',
	        value: function setBounds() {
	            this.map.drawMapFromLayers();
	        }
	    }, {
	        key: 'setIconOnMarker',
	        value: function setIconOnMarker(markerId, icon) {
	            markerId = markerId.toString();

	            var marker = this.markers.filter(function (marker) {
	                return marker.id.toString() === markerId;
	            });

	            if (marker.length && icon) {
	                marker[0].setIcon(icon);
	            }
	        }
	    }, {
	        key: 'clickOnMarker',
	        value: function clickOnMarker(markerId) {
	            this.focusOnMarker(markerId, true, true);
	        }
	    }, {
	        key: 'focusOnMarker',
	        value: function focusOnMarker(markerId) {
	            var showInfoWindow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	            var pan = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	            markerId = markerId.toString();

	            var marker = this.markers.filter(function (marker) {
	                return marker.id.toString() === markerId;
	            });

	            if (marker.length) {
	                if (pan) {
	                    this.map.moveTo(marker[0].getPosition());
	                }

	                if (showInfoWindow) {
	                    marker[0]._triggerClickEvent();
	                }
	            }
	        }
	    }, {
	        key: 'getDirections',
	        value: function getDirections(origin, destination, options, callback) {
	            if (!directionsService) {
	                DirectionsService = __webpack_require__(25);
	                directionsService = new DirectionsService(this.domId, options.panelSelector);
	            }

	            directionsService.getRoute(origin, destination, this.options.map, options, callback);
	        }
	    }, {
	        key: 'setCenter',
	        value: function setCenter(lat, lng) {
	            if (this.map) {
	                this.map.panTo({
	                    lon: lng,
	                    lat: lat
	                });
	            }
	        }
	    }, {
	        key: 'setZoom',
	        value: function setZoom(level) {
	            if (this.map) {
	                this.map.setZoomLevel(level);
	            }
	        }
	    }, {
	        key: 'addMarkers',
	        value: function addMarkers(points) {
	            var clusterIndex = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	            var clusterConfig = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	            if (Object.prototype.toString.call(points) !== '[object Array]') {
	                points = [points];
	            }

	            var markers = [];
	            var options = {};

	            for (var i = 0; i < points.length; i++) {
	                options = Object.assign({}, this.options.marker, points[i].options ? points[i].options : {});

	                if (typeof options.activeInfoWindow === "undefined" || options.activeInfoWindow === null) {
	                    options.activeInfoWindow = this.options.activeInfoWindow;
	                }

	                if (typeof options.activeCluster === "undefined" || options.activeCluster === null) {
	                    options.activeCluster = this.options.activeCluster;
	                }

	                points[i].options = options;

	                if (this.map) {
	                    var marker = new Marker(points[i], options);
	                    markers.push(marker);
	                    this.markers.push(marker);
	                    this.map.addLayer(marker);
	                }
	            }

	            this.setCluster(markers, clusterIndex, clusterConfig);

	            return markers;
	        }
	    }, {
	        key: 'setCluster',
	        value: function setCluster(markers) {
	            var clusterIndex = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	            var clusterConfig = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	            if (this.map && this.options.activeCluster && clusterIndex !== null) {

	                if (!clusterConfig) {
	                    clusterConfig = this.options.markerCluster;
	                }

	                if (this.markerClusterers[clusterIndex]) {
	                    for (var i = 0; i < markers.length; i++) {
	                        this.markerClusterers[clusterIndex].markers.push(markers[i]);
	                    }
	                } else {
	                    var cluster = markerClusterer.init(this.map, markers, clusterConfig);
	                    this.markerClusterers.push(cluster);
	                }
	            }
	        }
	    }]);

	    return ViaMichelinMap;
	})(Map);

	function getLargestBounds(bounds, point) {
	    return [[bounds[0][0] ? Math.min(bounds[0][0], point.latitude) : point.latitude, bounds[0][1] ? Math.min(bounds[0][1], point.longitude) : point.longitude], [bounds[1][0] ? Math.max(bounds[1][0], point.latitude) : point.latitude, bounds[1][0] ? Math.max(bounds[1][1], point.longitude) : point.longitude]];
	}

	window.Map = ViaMichelinMap;

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

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var objectAssign = __webpack_require__(6);

	var Marker = function Marker(point, options) {
	    _classCallCheck(this, Marker);

	    var opts = objectAssign({}, options);

	    if (options && options.overlayText && typeof options.overlayText.text === 'function') {
	        objectAssign(opts, {
	            overlayText: {
	                text: options.overlayText.text(point) || ''
	            }
	        });
	    }

	    if (options && options.title && typeof options.title.text === 'function') {
	        objectAssign(opts, {
	            title: options.title.text(point) || ''
	        });
	    }

	    var marker = new ViaMichelin.Api.Map.Marker(objectAssign(opts, {
	        coords: { lon: parseFloat(point.longitude), lat: parseFloat(point.latitude) } // Parse float : security for lat/lng passed in string (create a bug on clusters)
	    }));

	    marker.id = point.id;

	    if (options && options.activeInfoWindow) {
	        if (typeof options.htm === 'function') {

	            marker.addEventListener("onClick", function () {
	                marker.setBubbleContent(options.htm(point.data) || '');
	            });
	        } else {
	            marker.setBubbleContent(options.htm);
	        }
	    }

	    return marker;
	};

	module.exports = Marker;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var objectAssign = __webpack_require__(6);

	module.exports = {
	    init: function init(map, markers, options) {
	        var opts = objectAssign({
	            gridSize: 70
	        }, options);

	        return new ViaMichelin.Api.Map.MarkerClusterer(objectAssign(opts, {
	            map: map,
	            markers: markers
	        }));
	    }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var objectAssign = __webpack_require__(6);

	/* jshint newcap: false */
	module.exports = {
	    mapInstance: function mapInstance(domId, options, onSuccess) {
	        var defaultOptions = {
	            center: { coords: { lon: 0, lat: 0 } }
	        };

	        VMLaunch('ViaMichelin.Api.Map', objectAssign(defaultOptions, options, {
	            container: $_id(domId) // jshint ignore:line
	        }), {
	            onSuccess: onSuccess
	        });
	    },

	    itineraryInstance: function itineraryInstance(origin, destination, domId, panelElement, options, callback) {
	        VMLaunch('ViaMichelin.Api.Itinerary', {
	            map: {
	                container: $_id(domId), // jshint ignore:line
	                focus: true
	            },
	            roadsheet: panelElement,
	            steps: [{
	                address: {
	                    city: origin,
	                    countryISOCode: options.region || ''
	                }
	            }, {
	                address: {
	                    city: destination,
	                    countryISOCode: options.region || ''
	                }
	            }]
	        }, {
	            onSuccess: callback
	        });
	    }
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var objectAssign = __webpack_require__(6);
	var vmService = __webpack_require__(24);

	var DirectionsService = (function () {
	    function DirectionsService(domId, panelSelector) {
	        _classCallCheck(this, DirectionsService);

	        this.domId = domId;
	        this.panelElement = document.querySelector(panelSelector);
	    }

	    _createClass(DirectionsService, [{
	        key: 'getRoute',
	        value: function getRoute(origin, destination, mapOptions, options, callback) {
	            var self = this;

	            if (!self.map) {
	                vmService.mapInstance(this.domId, objectAssign({}, mapOptions, { center: ViaMichelin.Api.Constants.Map.DELAY_LOADING }), function (map) {
	                    self.map = map;

	                    vmService.itineraryInstance(origin, destination, self.domId, self.panelElement, options, function (itinerary) {
	                        callback(itinerary);
	                    });
	                });
	            } else {
	                self.map.removeAllLayers();
	                self.panelElement.innerHTML = '';

	                vmService.itineraryInstance(origin, destination, self.domId, self.panelElement, options, function (itinerary) {
	                    callback(itinerary);
	                });
	            }
	        }
	    }]);

	    return DirectionsService;
	})();

	module.exports = DirectionsService;

/***/ }
/******/ ]);