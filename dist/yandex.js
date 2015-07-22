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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var Map = __webpack_require__(1);
	var domUtils = __webpack_require__(7);
	var loaderUtils = __webpack_require__(8);
	var Marker = undefined;
	var MarkerCluster = undefined;
	var TileLayer = undefined;

	var Yandex = (function (_Map) {
	    _inherits(Yandex, _Map);

	    function Yandex() {
	        _classCallCheck(this, Yandex);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _get(Object.getPrototypeOf(Yandex.prototype), 'constructor', this).apply(this, args);

	        this.provider = 'Yandex';
	        this.map = '';
	        this.markers = [];
	        this.cluster = null;
	    }

	    _createClass(Yandex, [{
	        key: 'render',
	        value: function render() {
	            var _this = this;

	            // Init the map
	            this.map = new L.Map(this.domElement, { center: new L.LatLng(67.6755, 33.936), zoom: 10, zoomAnimation: false });
	            this.map.addLayer(new TileLayer());
	            var bounds = L.latLngBounds([]);

	            // Init the clustering if the option is set
	            if (this.options.markerCluster.active) {
	                this.cluster = new MarkerCluster(this.options.markerCluster);
	                this.map.addLayer(this.cluster);
	            }

	            // Create a marker for each point
	            this.points.forEach(function (point) {
	                var marker = new Marker(point, _this.options.marker);
	                _this.markers.push(marker);

	                // Bind the info window is the option is set
	                if (_this.options.infoWindow.active) {
	                    marker.bindPopup(L.popup(_this.options.infoWindow).setContent(_this.options.infoWindow.content(point.data)));
	                }

	                bounds.extend([point.latitude, point.longitude]);

	                if (_this.options.markerCluster.active) {
	                    _this.cluster.addLayer(marker);
	                } else {
	                    marker.addTo(_this.map);
	                }
	            });

	            // Center the map
	            this.map.fitBounds(bounds);
	        }
	    }, {
	        key: 'load',
	        value: function load(callback, loadingMask, clustered) {
	            var _this2 = this;

	            var resources = [domUtils.createScript('http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js'), domUtils.createStyle('http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css'), domUtils.createScript('http://api-maps.yandex.ru/2.0/?load=package.map&lang=ru-RU')];

	            domUtils.addResources(this.domElement, resources, function () {
	                Marker = __webpack_require__(15);
	                TileLayer = __webpack_require__(17);

	                if (clustered) {
	                    domUtils.addResources(_this2.domElement, [domUtils.createScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/leaflet.markercluster.js'), domUtils.createStyle('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.Default.css'), domUtils.createStyle('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.css')], function () {
	                        MarkerCluster = __webpack_require__(18);
	                        callback();
	                    });
	                } else {
	                    callback();
	                }
	            });
	        }
	    }, {
	        key: 'clickOnMarker',
	        value: function clickOnMarker(markerId) {
	            markerId = markerId.toString();
	            var marker = this.markers.filter(function (marker) {
	                return marker.id.toString() === markerId;
	            });

	            if (marker.length) {
	                marker[0].togglePopup();
	            }
	        }
	    }]);

	    return Yandex;
	})(Map);

	window.Map = Yandex;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	__webpack_require__(2);
	var objectAssign = __webpack_require__(6);

	var Map = (function () {
	    function Map(domElement, apiKey, options) {
	        _classCallCheck(this, Map);

	        this.domElement = domElement;
	        this.apiKey = apiKey;
	        this.setOptions(options);
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
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    addScript: function addScript(domElement, src) {
	        domElement.appendChild(this.createScript(src));
	    },

	    addStyle: function addStyle(domElement, href) {
	        domElement.appendChild(this.createStyle(href));
	    },

	    addResources: function addResources(domElement, resources, callback) {
	        var nbLoaded = 0;

	        resources.forEach(function (resource) {
	            resource.addEventListener('load', function () {
	                nbLoaded++;

	                if (nbLoaded === resources.length) {
	                    callback();
	                }
	            }, false);

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
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);
	var Label = __webpack_require__(16);

	var Marker = (function (_L$Marker) {
	    _inherits(Marker, _L$Marker);

	    function Marker(point, options) {
	        _classCallCheck(this, Marker);

	        if (options.label) {
	            _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, [point.latitude, point.longitude], objectAssign({}, options, {
	                icon: new Label(options.label(point), options.icon)
	            }));
	        } else {
	            _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, [point.latitude, point.longitude], objectAssign({}, options, {
	                icon: L.icon(options.icon)
	            }));
	        }

	        this.id = point.id;
	    }

	    return Marker;
	})(L.Marker);

	module.exports = Marker;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);

	var Label = (function (_L$Icon) {
	    _inherits(Label, _L$Icon);

	    function Label(content, options) {
	        _classCallCheck(this, Label);

	        _get(Object.getPrototypeOf(Label.prototype), 'constructor', this).call(this, options);

	        //this.point = point;
	        this.content = content;
	    }

	    _createClass(Label, [{
	        key: 'createIcon',
	        value: function createIcon() {
	            var label = document.createElement('div');
	            var icon = _get(Object.getPrototypeOf(Label.prototype), 'createIcon', this).call(this);

	            label.appendChild(icon);
	            label.innerHTML += this.content; //(this.point) || '';
	            label.style.height = 0;

	            return label;
	        }
	    }]);

	    return Label;
	})(L.Icon);

	module.exports = Label;

/***/ },
/* 17 */
/***/ function(module, exports) {

	/*
	 * L.TileLayer is used for standard xyz-numbered tile layers.
	 */

	/* global ymaps: true */

	'use strict';

	module.exports = L.Class.extend({
	    includes: L.Mixin.Events,

	    options: {
	        minZoom: 0,
	        maxZoom: 18,
	        attribution: '',
	        opacity: 1,
	        traffic: false
	    },

	    possibleShortMapTypes: {
	        schemaMap: 'map',
	        satelliteMap: 'satellite',
	        hybridMap: 'hybrid',
	        publicMap: 'publicMap',
	        publicMapInHybridView: 'publicMapHybrid'
	    },

	    _getPossibleMapType: function _getPossibleMapType(mapType) {
	        var result = 'yandex#map';
	        if (typeof mapType !== 'string') {
	            return result;
	        }
	        for (var key in this.possibleShortMapTypes) {
	            if (mapType === this.possibleShortMapTypes[key]) {
	                result = 'yandex#' + mapType;
	                break;
	            }
	            if (mapType === 'yandex#' + this.possibleShortMapTypes[key]) {
	                result = mapType;
	            }
	        }
	        return result;
	    },

	    // Possible types: yandex#map, yandex#satellite, yandex#hybrid, yandex#publicMap, yandex#publicMapHybrid
	    // Or their short names: map, satellite, hybrid, publicMap, publicMapHybrid
	    initialize: function initialize(type, options) {
	        L.Util.setOptions(this, options);
	        //Assigning an initial map type for the Yandex layer
	        this._type = this._getPossibleMapType(type);
	    },

	    onAdd: function onAdd(map, insertAtTheBottom) {
	        this._map = map;
	        this._insertAtTheBottom = insertAtTheBottom;

	        // create a container div for tiles
	        this._initContainer();
	        this._initMapObject();

	        // set up events
	        map.on('viewreset', this._resetCallback, this);

	        this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
	        map.on('move', this._update, this);

	        map._controlCorners.bottomright.style.marginBottom = '3em';

	        this._reset();
	        this._update(true);
	    },

	    onRemove: function onRemove(map) {
	        this._map._container.removeChild(this._container);

	        this._map.off('viewreset', this._resetCallback, this);

	        this._map.off('move', this._update, this);

	        map._controlCorners.bottomright.style.marginBottom = '0em';
	    },

	    getAttribution: function getAttribution() {
	        return this.options.attribution;
	    },

	    setOpacity: function setOpacity(opacity) {
	        this.options.opacity = opacity;
	        if (opacity < 1) {
	            L.DomUtil.setOpacity(this._container, opacity);
	        }
	    },

	    setElementSize: function setElementSize(e, size) {
	        e.style.width = size.x + 'px';
	        e.style.height = size.y + 'px';
	    },

	    _initContainer: function _initContainer() {
	        var tilePane = this._map._container,
	            first = tilePane.firstChild;

	        if (!this._container) {
	            this._container = L.DomUtil.create('div', 'leaflet-yandex-layer leaflet-top leaflet-left');
	            this._container.id = '_YMapContainer_' + L.Util.stamp(this);
	            this._container.style.zIndex = 'auto';
	        }

	        if (this.options.overlay) {
	            first = this._map._container.getElementsByClassName('leaflet-map-pane')[0];
	            first = first.nextSibling;
	            // XXX: Bug with layer order
	            if (L.Browser.opera) this._container.className += ' leaflet-objects-pane';
	        }
	        tilePane.insertBefore(this._container, first);

	        this.setOpacity(this.options.opacity);
	        this.setElementSize(this._container, this._map.getSize());
	    },

	    _initMapObject: function _initMapObject() {
	        if (this._yandex) return;

	        // Check that ymaps.Map is ready
	        if (ymaps.Map === undefined) {
	            return ymaps.load(['package.map'], this._initMapObject, this);
	        }

	        // If traffic layer is requested check if control.TrafficControl is ready
	        if (this.options.traffic) if (ymaps.control === undefined || ymaps.control.TrafficControl === undefined) {
	            return ymaps.load(['package.traffic', 'package.controls'], this._initMapObject, this);
	        }
	        //Creating ymaps map-object without any default controls on it
	        var map = new ymaps.Map(this._container, { center: [0, 0], zoom: 0, behaviors: [], controls: [] });

	        if (this.options.traffic) map.controls.add(new ymaps.control.TrafficControl({ shown: true }));

	        if (this._type === 'yandex#null') {
	            this._type = new ymaps.MapType('null', []);
	            map.container.getElement().style.background = 'transparent';
	        }
	        map.setType(this._type);

	        this._yandex = map;
	        this._update(true);

	        //Reporting that map-object was initialized
	        this.fire('MapObjectInitialized', { mapObject: map });
	    },

	    _resetCallback: function _resetCallback(e) {
	        this._reset(e.hard);
	    },

	    _reset: function _reset(clearOldContainer) {
	        this._initContainer();
	    },

	    _update: function _update(force) {
	        if (!this._yandex) return;
	        this._resize(force);

	        var center = this._map.getCenter();
	        var _center = [center.lat, center.lng];
	        var zoom = this._map.getZoom();

	        if (force || this._yandex.getZoom() !== zoom) this._yandex.setZoom(zoom);
	        this._yandex.panTo(_center, { duration: 0, delay: 0 });
	    },

	    _resize: function _resize(force) {
	        var size = this._map.getSize(),
	            style = this._container.style;
	        if (style.width === size.x + 'px' && style.height === size.y + 'px') if (force !== true) return;
	        this.setElementSize(this._container, size);
	        var b = this._map.getBounds(),
	            sw = b.getSouthWest(),
	            ne = b.getNorthEast();
	        this._yandex.container.fitToViewport();
	    }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var Label = __webpack_require__(16);

	var MarkerCluster = (function (_L$MarkerClusterGroup) {
	    _inherits(MarkerCluster, _L$MarkerClusterGroup);

	    function MarkerCluster(options) {
	        _classCallCheck(this, MarkerCluster);

	        // todo use Label instead of just icon if marker.label

	        if (options.icon) {
	            options.iconCreateFunction = function (cluster) {
	                //return L.icon({
	                //    iconUrl: './marker.png',
	                //    iconAnchor: [0, 32],
	                //    popupAnchor: [16, -32]
	                //})

	                var content = '<div class="' + options.labelClass + '"><span>' + cluster.getChildCount() + '</span></div>';

	                //return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });

	                return new Label(content, options.icon);
	            };
	        }

	        _get(Object.getPrototypeOf(MarkerCluster.prototype), 'constructor', this).call(this, options);
	    }

	    return MarkerCluster;
	})(L.MarkerClusterGroup);

	module.exports = MarkerCluster;

/***/ }
/******/ ]);