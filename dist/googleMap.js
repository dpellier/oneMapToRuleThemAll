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

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var Map = __webpack_require__(1);
	var domUtils = __webpack_require__(7);
	var loaderUtils = __webpack_require__(8);
	var MarkerClusterer = __webpack_require__(10);

	var GoogleMap = (function (_Map) {
	    function GoogleMap() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _classCallCheck(this, GoogleMap);

	        _get(Object.getPrototypeOf(GoogleMap.prototype), 'constructor', this).apply(this, args);

	        this.provider = 'Google Map';
	        this.map = null;
	        this.markers = [];
	        this.infoWindow = null;
	        this.markerClusterer = null;
	    }

	    _inherits(GoogleMap, _Map);

	    _createClass(GoogleMap, [{
	        key: 'render',
	        value: function render() {
	            var _this = this;

	            // Require google object here cause they're not loaded before
	            var InfoWindow = __webpack_require__(11);
	            var Marker = __webpack_require__(12);

	            // Init the map
	            this.map = new google.maps.Map(this.domElement, this.options.map);
	            var bounds = new google.maps.LatLngBounds();

	            // Init the info window is the option is set
	            if (this.options.infoWindow.active) {
	                this.infoWindow = new InfoWindow(this.options.infoWindow);
	            }

	            // Create a marker for each point
	            this.points.forEach(function (point) {
	                var marker = new Marker(_this.map, point, _this.options.marker);
	                bounds.extend(marker.position);

	                _this.markers.push(marker);

	                // Bind the info window on marker click if the option is set
	                if (_this.options.infoWindow.active) {
	                    google.maps.event.addListener(marker, 'click', function () {
	                        if (_this.infoWindow.anchor && _this.infoWindow.anchor.id === marker.id) {
	                            _this.infoWindow.close();
	                        } else {
	                            _this.infoWindow.open(point.data, _this.map, marker);
	                        }
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
	            if (this.options.markerCluster.active) {
	                this.markerClusterer = new MarkerClusterer(this.map, this.markers, this.options.markerCluster);
	            }
	        }
	    }, {
	        key: 'load',
	        value: function load(callback, loadingMask) {
	            window._googleMapCallbackOnLoad = function () {
	                delete window._googleMapCallbackOnLoad;
	                callback();
	            };

	            if (loadingMask) {
	                window._googleMapCallbackOnLoad = loaderUtils.addLoader(this.domElement, loadingMask, window._googleMapCallbackOnLoad);
	            }

	            domUtils.addScript(this.domElement, 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey);
	        }
	    }, {
	        key: 'clickOnMarker',
	        value: function clickOnMarker(markerId) {
	            var marker = this.markers.filter(function (marker) {
	                return marker.id === markerId;
	            });

	            if (marker.length) {
	                // If the marker is inside a cluster, we have to zoom to it before triggering the click
	                if (this.options.markerCluster.active && !marker[0].getMap()) {
	                    this.map.setZoom(17);
	                    this.map.panTo(marker[0].position);

	                    // We trigger the info window only after the pan has finished
	                    google.maps.event.addListenerOnce(this.map, 'idle', function () {
	                        new google.maps.event.trigger(marker[0], 'click');
	                    });
	                } else {
	                    new google.maps.event.trigger(marker[0], 'click');
	                }
	            }
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
	            this.points = points;
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
/***/ function(module, exports, __webpack_require__) {

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
/***/ function(module, exports, __webpack_require__) {

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
/***/ function(module, exports, __webpack_require__) {

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	function ClusterIcon(cluster,styles){cluster.getMarkerClusterer().extend(ClusterIcon,google.maps.OverlayView),this.cluster_=cluster,this.className_=cluster.getMarkerClusterer().getClusterClass(),this.styles_=styles,this.center_=null,this.div_=null,this.sums_=null,this.visible_=!1,this.setMap(cluster.getMap())}function Cluster(mc){this.markerClusterer_=mc,this.map_=mc.getMap(),this.gridSize_=mc.getGridSize(),this.minClusterSize_=mc.getMinimumClusterSize(),this.averageCenter_=mc.getAverageCenter(),this.hideLabel_=mc.getHideLabel(),this.markers_=[],this.center_=null,this.bounds_=null,this.clusterIcon_=new ClusterIcon(this,mc.getStyles())}function MarkerClusterer(map,opt_markers,opt_options){this.extend(MarkerClusterer,google.maps.OverlayView),opt_markers=opt_markers||[],opt_options=opt_options||{},this.markers_=[],this.clusters_=[],this.listeners_=[],this.activeMap_=null,this.ready_=!1,this.gridSize_=opt_options.gridSize||60,this.minClusterSize_=opt_options.minimumClusterSize||2,this.maxZoom_=opt_options.maxZoom||null,this.styles_=opt_options.styles||[],this.title_=opt_options.title||"",this.zoomOnClick_=!0,void 0!==opt_options.zoomOnClick&&(this.zoomOnClick_=opt_options.zoomOnClick),this.averageCenter_=!1,void 0!==opt_options.averageCenter&&(this.averageCenter_=opt_options.averageCenter),this.ignoreHidden_=!1,void 0!==opt_options.ignoreHidden&&(this.ignoreHidden_=opt_options.ignoreHidden),this.enableRetinaIcons_=!1,void 0!==opt_options.enableRetinaIcons&&(this.enableRetinaIcons_=opt_options.enableRetinaIcons),this.hideLabel_=!1,void 0!==opt_options.hideLabel&&(this.hideLabel_=opt_options.hideLabel),this.imagePath_=opt_options.imagePath||MarkerClusterer.IMAGE_PATH,this.imageExtension_=opt_options.imageExtension||MarkerClusterer.IMAGE_EXTENSION,this.imageSizes_=opt_options.imageSizes||MarkerClusterer.IMAGE_SIZES,this.calculator_=opt_options.calculator||MarkerClusterer.CALCULATOR,this.batchSize_=opt_options.batchSize||MarkerClusterer.BATCH_SIZE,this.batchSizeIE_=opt_options.batchSizeIE||MarkerClusterer.BATCH_SIZE_IE,this.clusterClass_=opt_options.clusterClass||"cluster",-1!==navigator.userAgent.toLowerCase().indexOf("msie")&&(this.batchSize_=this.batchSizeIE_),this.setupStyles_(),this.addMarkers(opt_markers,!0),this.setMap(map)}ClusterIcon.prototype.onAdd=function(){var cMouseDownInCluster,cDraggingMapByCluster,cClusterIcon=this;this.div_=document.createElement("div"),this.div_.className=this.className_,this.visible_&&this.show(),this.getPanes().overlayMouseTarget.appendChild(this.div_),this.boundsChangedListener_=google.maps.event.addListener(this.getMap(),"bounds_changed",function(){cDraggingMapByCluster=cMouseDownInCluster}),google.maps.event.addDomListener(this.div_,"mousedown",function(){cMouseDownInCluster=!0,cDraggingMapByCluster=!1}),google.maps.event.addDomListener(this.div_,"click",function(e){if(cMouseDownInCluster=!1,!cDraggingMapByCluster){var theBounds,mz,mc=cClusterIcon.cluster_.getMarkerClusterer();google.maps.event.trigger(mc,"click",cClusterIcon.cluster_),google.maps.event.trigger(mc,"clusterclick",cClusterIcon.cluster_),mc.getZoomOnClick()&&(mz=mc.getMaxZoom(),theBounds=cClusterIcon.cluster_.getBounds(),mc.getMap().fitBounds(theBounds),setTimeout(function(){mc.getMap().fitBounds(theBounds),null!==mz&&mc.getMap().getZoom()>mz&&mc.getMap().setZoom(mz+1)},100)),e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation()}}),google.maps.event.addDomListener(this.div_,"mouseover",function(){var mc=cClusterIcon.cluster_.getMarkerClusterer();google.maps.event.trigger(mc,"mouseover",cClusterIcon.cluster_)}),google.maps.event.addDomListener(this.div_,"mouseout",function(){var mc=cClusterIcon.cluster_.getMarkerClusterer();google.maps.event.trigger(mc,"mouseout",cClusterIcon.cluster_)})},ClusterIcon.prototype.onRemove=function(){this.div_&&this.div_.parentNode&&(this.hide(),google.maps.event.removeListener(this.boundsChangedListener_),google.maps.event.clearInstanceListeners(this.div_),this.div_.parentNode.removeChild(this.div_),this.div_=null)},ClusterIcon.prototype.draw=function(){if(this.visible_){var pos=this.getPosFromLatLng_(this.center_);this.div_.style.top=pos.y+"px",this.div_.style.left=pos.x+"px"}},ClusterIcon.prototype.hide=function(){this.div_&&(this.div_.style.display="none"),this.visible_=!1},ClusterIcon.prototype.show=function(){if(this.div_){var img="",bp=this.backgroundPosition_.split(" "),spriteH=parseInt(bp[0].trim(),10),spriteV=parseInt(bp[1].trim(),10),pos=this.getPosFromLatLng_(this.center_);this.div_.style.cssText=this.createCss(pos),img="<img src='"+this.url_+"' style='position: absolute; top: "+spriteV+"px; left: "+spriteH+"px; ",img+=this.cluster_.getMarkerClusterer().enableRetinaIcons_?"width: "+this.width_+"px;height: "+this.height_+"px;":"clip: rect("+-1*spriteV+"px, "+(-1*spriteH+this.width_)+"px, "+(-1*spriteV+this.height_)+"px, "+-1*spriteH+"px);",img+="'>",this.div_.innerHTML=img+"<div style='position: absolute;top: "+this.anchorText_[0]+"px;left: "+this.anchorText_[1]+"px;color: "+this.textColor_+";font-size: "+this.textSize_+"px;font-family: "+this.fontFamily_+";font-weight: "+this.fontWeight_+";font-style: "+this.fontStyle_+";text-decoration: "+this.textDecoration_+";text-align: center;width: "+this.width_+"px;line-height:"+this.height_+"px;'>"+(this.cluster_.hideLabel_?" ":this.sums_.text)+"</div>","undefined"==typeof this.sums_.title||""===this.sums_.title?this.div_.title=this.cluster_.getMarkerClusterer().getTitle():this.div_.title=this.sums_.title,this.div_.style.display=""}this.visible_=!0},ClusterIcon.prototype.useStyle=function(sums){this.sums_=sums;var index=Math.max(0,sums.index-1);index=Math.min(this.styles_.length-1,index);var style=this.styles_[index];this.url_=style.url,this.height_=style.height,this.width_=style.width,this.anchorText_=style.anchorText||[0,0],this.anchorIcon_=style.anchorIcon||[parseInt(this.height_/2,10),parseInt(this.width_/2,10)],this.textColor_=style.textColor||"black",this.textSize_=style.textSize||11,this.textDecoration_=style.textDecoration||"none",this.fontWeight_=style.fontWeight||"bold",this.fontStyle_=style.fontStyle||"normal",this.fontFamily_=style.fontFamily||"Arial,sans-serif",this.backgroundPosition_=style.backgroundPosition||"0 0"},ClusterIcon.prototype.setCenter=function(center){this.center_=center},ClusterIcon.prototype.createCss=function(pos){var style=[];return style.push("cursor: pointer;"),style.push("position: absolute; top: "+pos.y+"px; left: "+pos.x+"px;"),style.push("width: "+this.width_+"px; height: "+this.height_+"px;"),style.join("")},ClusterIcon.prototype.getPosFromLatLng_=function(latlng){var pos=this.getProjection().fromLatLngToDivPixel(latlng);return pos.x-=this.anchorIcon_[1],pos.y-=this.anchorIcon_[0],pos.x=parseInt(pos.x,10),pos.y=parseInt(pos.y,10),pos},Cluster.prototype.getSize=function(){return this.markers_.length},Cluster.prototype.getMarkers=function(){return this.markers_},Cluster.prototype.getCenter=function(){return this.center_},Cluster.prototype.getMap=function(){return this.map_},Cluster.prototype.getMarkerClusterer=function(){return this.markerClusterer_},Cluster.prototype.getBounds=function(){var i,bounds=new google.maps.LatLngBounds(this.center_,this.center_),markers=this.getMarkers();for(i=0;i<markers.length;i++)bounds.extend(markers[i].getPosition());return bounds},Cluster.prototype.remove=function(){this.clusterIcon_.setMap(null),this.markers_=[],delete this.markers_},Cluster.prototype.addMarker=function(marker){var i,mCount,mz;if(this.isMarkerAlreadyAdded_(marker))return!1;if(this.center_){if(this.averageCenter_){var l=this.markers_.length+1,lat=(this.center_.lat()*(l-1)+marker.getPosition().lat())/l,lng=(this.center_.lng()*(l-1)+marker.getPosition().lng())/l;this.center_=new google.maps.LatLng(lat,lng),this.calculateBounds_()}}else this.center_=marker.getPosition(),this.calculateBounds_();if(marker.isAdded=!0,this.markers_.push(marker),mCount=this.markers_.length,mz=this.markerClusterer_.getMaxZoom(),null!==mz&&this.map_.getZoom()>mz)marker.getMap()!==this.map_&&marker.setMap(this.map_);else if(mCount<this.minClusterSize_)marker.getMap()!==this.map_&&marker.setMap(this.map_);else if(mCount===this.minClusterSize_)for(i=0;mCount>i;i++)this.markers_[i].setMap(null);else marker.setMap(null);return!0},Cluster.prototype.isMarkerInClusterBounds=function(marker){return this.bounds_.contains(marker.getPosition())},Cluster.prototype.calculateBounds_=function(){var bounds=new google.maps.LatLngBounds(this.center_,this.center_);this.bounds_=this.markerClusterer_.getExtendedBounds(bounds)},Cluster.prototype.updateIcon_=function(){var mCount=this.markers_.length,mz=this.markerClusterer_.getMaxZoom();if(null!==mz&&this.map_.getZoom()>mz)return void this.clusterIcon_.hide();if(mCount<this.minClusterSize_)return void this.clusterIcon_.hide();var numStyles=this.markerClusterer_.getStyles().length,sums=this.markerClusterer_.getCalculator()(this.markers_,numStyles);this.clusterIcon_.setCenter(this.center_),this.clusterIcon_.useStyle(sums),this.clusterIcon_.show()},Cluster.prototype.isMarkerAlreadyAdded_=function(marker){for(var i=0,n=this.markers_.length;n>i;i++)if(marker===this.markers_[i])return!0;return!1},MarkerClusterer.prototype.onAdd=function(){var cMarkerClusterer=this;this.activeMap_=this.getMap(),this.ready_=!0,this.repaint(),this.listeners_=[google.maps.event.addListener(this.getMap(),"zoom_changed",function(){cMarkerClusterer.resetViewport_(!1),(this.getZoom()===(this.get("minZoom")||0)||this.getZoom()===this.get("maxZoom"))&&google.maps.event.trigger(this,"idle")}),google.maps.event.addListener(this.getMap(),"idle",function(){cMarkerClusterer.redraw_()})]},MarkerClusterer.prototype.onRemove=function(){var i;for(i=0;i<this.markers_.length;i++)this.markers_[i].getMap()!==this.activeMap_&&this.markers_[i].setMap(this.activeMap_);for(i=0;i<this.clusters_.length;i++)this.clusters_[i].remove();for(this.clusters_=[],i=0;i<this.listeners_.length;i++)google.maps.event.removeListener(this.listeners_[i]);this.listeners_=[],this.activeMap_=null,this.ready_=!1},MarkerClusterer.prototype.draw=function(){},MarkerClusterer.prototype.setupStyles_=function(){var i,size;if(!(this.styles_.length>0))for(i=0;i<this.imageSizes_.length;i++)size=this.imageSizes_[i],this.styles_.push({url:this.imagePath_+(i+1)+"."+this.imageExtension_,height:size,width:size})},MarkerClusterer.prototype.fitMapToMarkers=function(){var i,markers=this.getMarkers(),bounds=new google.maps.LatLngBounds;for(i=0;i<markers.length;i++)bounds.extend(markers[i].getPosition());this.getMap().fitBounds(bounds)},MarkerClusterer.prototype.getGridSize=function(){return this.gridSize_},MarkerClusterer.prototype.setGridSize=function(gridSize){this.gridSize_=gridSize},MarkerClusterer.prototype.getMinimumClusterSize=function(){return this.minClusterSize_},MarkerClusterer.prototype.setMinimumClusterSize=function(minimumClusterSize){this.minClusterSize_=minimumClusterSize},MarkerClusterer.prototype.getMaxZoom=function(){return this.maxZoom_},MarkerClusterer.prototype.setMaxZoom=function(maxZoom){this.maxZoom_=maxZoom},MarkerClusterer.prototype.getStyles=function(){return this.styles_},MarkerClusterer.prototype.setStyles=function(styles){this.styles_=styles},MarkerClusterer.prototype.getTitle=function(){return this.title_},MarkerClusterer.prototype.setTitle=function(title){this.title_=title},MarkerClusterer.prototype.getZoomOnClick=function(){return this.zoomOnClick_},MarkerClusterer.prototype.setZoomOnClick=function(zoomOnClick){this.zoomOnClick_=zoomOnClick},MarkerClusterer.prototype.getAverageCenter=function(){return this.averageCenter_},MarkerClusterer.prototype.setAverageCenter=function(averageCenter){this.averageCenter_=averageCenter},MarkerClusterer.prototype.getIgnoreHidden=function(){return this.ignoreHidden_},MarkerClusterer.prototype.setIgnoreHidden=function(ignoreHidden){this.ignoreHidden_=ignoreHidden},MarkerClusterer.prototype.getEnableRetinaIcons=function(){return this.enableRetinaIcons_},MarkerClusterer.prototype.setEnableRetinaIcons=function(enableRetinaIcons){this.enableRetinaIcons_=enableRetinaIcons},MarkerClusterer.prototype.getImageExtension=function(){return this.imageExtension_},MarkerClusterer.prototype.setImageExtension=function(imageExtension){this.imageExtension_=imageExtension},MarkerClusterer.prototype.getImagePath=function(){return this.imagePath_},MarkerClusterer.prototype.setImagePath=function(imagePath){this.imagePath_=imagePath},MarkerClusterer.prototype.getImageSizes=function(){return this.imageSizes_},MarkerClusterer.prototype.setImageSizes=function(imageSizes){this.imageSizes_=imageSizes},MarkerClusterer.prototype.getCalculator=function(){return this.calculator_},MarkerClusterer.prototype.setCalculator=function(calculator){this.calculator_=calculator},MarkerClusterer.prototype.setHideLabel=function(hideLabel){this.hideLabel_=hideLabel},MarkerClusterer.prototype.getHideLabel=function(){return this.hideLabel_},MarkerClusterer.prototype.getBatchSizeIE=function(){return this.batchSizeIE_},MarkerClusterer.prototype.setBatchSizeIE=function(batchSizeIE){this.batchSizeIE_=batchSizeIE},MarkerClusterer.prototype.getClusterClass=function(){return this.clusterClass_},MarkerClusterer.prototype.setClusterClass=function(clusterClass){this.clusterClass_=clusterClass},MarkerClusterer.prototype.getMarkers=function(){return this.markers_},MarkerClusterer.prototype.getTotalMarkers=function(){return this.markers_.length},MarkerClusterer.prototype.getClusters=function(){return this.clusters_},MarkerClusterer.prototype.getTotalClusters=function(){return this.clusters_.length},MarkerClusterer.prototype.addMarker=function(marker,opt_nodraw){this.pushMarkerTo_(marker),opt_nodraw||this.redraw_()},MarkerClusterer.prototype.addMarkers=function(markers,opt_nodraw){var key;for(key in markers)markers.hasOwnProperty(key)&&this.pushMarkerTo_(markers[key]);opt_nodraw||this.redraw_()},MarkerClusterer.prototype.pushMarkerTo_=function(marker){if(marker.getDraggable()){var cMarkerClusterer=this;google.maps.event.addListener(marker,"dragend",function(){cMarkerClusterer.ready_&&(this.isAdded=!1,cMarkerClusterer.repaint())})}marker.isAdded=!1,this.markers_.push(marker)},MarkerClusterer.prototype.removeMarker=function(marker,opt_nodraw,opt_noMapRemove){var removeFromMap=!0&&!opt_noMapRemove,removed=this.removeMarker_(marker,removeFromMap);return!opt_nodraw&&removed&&this.repaint(),removed},MarkerClusterer.prototype.removeMarkers=function(markers,opt_nodraw,opt_noMapRemove){var i,r,removed=!1,removeFromMap=!0&&!opt_noMapRemove;for(i=0;i<markers.length;i++)r=this.removeMarker_(markers[i],removeFromMap),removed=removed||r;return!opt_nodraw&&removed&&this.repaint(),removed},MarkerClusterer.prototype.removeMarker_=function(marker,removeFromMap){var i,index=-1;if(this.markers_.indexOf)index=this.markers_.indexOf(marker);else for(i=0;i<this.markers_.length;i++)if(marker===this.markers_[i]){index=i;break}return-1===index?!1:(removeFromMap&&marker.setMap(null),this.markers_.splice(index,1),!0)},MarkerClusterer.prototype.clearMarkers=function(){this.resetViewport_(!0),this.markers_=[]},MarkerClusterer.prototype.repaint=function(){var oldClusters=this.clusters_.slice();this.clusters_=[],this.resetViewport_(!1),this.redraw_(),setTimeout(function(){var i;for(i=0;i<oldClusters.length;i++)oldClusters[i].remove()},0)},MarkerClusterer.prototype.getExtendedBounds=function(bounds){var projection=this.getProjection(),tr=new google.maps.LatLng(bounds.getNorthEast().lat(),bounds.getNorthEast().lng()),bl=new google.maps.LatLng(bounds.getSouthWest().lat(),bounds.getSouthWest().lng()),trPix=projection.fromLatLngToDivPixel(tr);trPix.x+=this.gridSize_,trPix.y-=this.gridSize_;var blPix=projection.fromLatLngToDivPixel(bl);blPix.x-=this.gridSize_,blPix.y+=this.gridSize_;var ne=projection.fromDivPixelToLatLng(trPix),sw=projection.fromDivPixelToLatLng(blPix);return bounds.extend(ne),bounds.extend(sw),bounds},MarkerClusterer.prototype.redraw_=function(){this.createClusters_(0)},MarkerClusterer.prototype.resetViewport_=function(opt_hide){var i,marker;for(i=0;i<this.clusters_.length;i++)this.clusters_[i].remove();for(this.clusters_=[],i=0;i<this.markers_.length;i++)marker=this.markers_[i],marker.isAdded=!1,opt_hide&&marker.setMap(null)},MarkerClusterer.prototype.distanceBetweenPoints_=function(p1,p2){var R=6371,dLat=(p2.lat()-p1.lat())*Math.PI/180,dLon=(p2.lng()-p1.lng())*Math.PI/180,a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(p1.lat()*Math.PI/180)*Math.cos(p2.lat()*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2),c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)),d=R*c;return d},MarkerClusterer.prototype.isMarkerInBounds_=function(marker,bounds){return bounds.contains(marker.getPosition())},MarkerClusterer.prototype.addToClosestCluster_=function(marker){var i,d,cluster,center,distance=4e4,clusterToAddTo=null;for(i=0;i<this.clusters_.length;i++)cluster=this.clusters_[i],center=cluster.getCenter(),center&&(d=this.distanceBetweenPoints_(center,marker.getPosition()),distance>d&&(distance=d,clusterToAddTo=cluster));clusterToAddTo&&clusterToAddTo.isMarkerInClusterBounds(marker)?clusterToAddTo.addMarker(marker):(cluster=new Cluster(this),cluster.addMarker(marker),this.clusters_.push(cluster))},MarkerClusterer.prototype.createClusters_=function(iFirst){var i,marker,mapBounds,cMarkerClusterer=this;if(this.ready_){0===iFirst&&(google.maps.event.trigger(this,"clusteringbegin",this),"undefined"!=typeof this.timerRefStatic&&(clearTimeout(this.timerRefStatic),delete this.timerRefStatic)),mapBounds=this.getMap().getZoom()>3?new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),this.getMap().getBounds().getNorthEast()):new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472,-178.48388434375),new google.maps.LatLng(-85.08136444384544,178.00048865625));var bounds=this.getExtendedBounds(mapBounds),iLast=Math.min(iFirst+this.batchSize_,this.markers_.length);for(i=iFirst;iLast>i;i++)marker=this.markers_[i],!marker.isAdded&&this.isMarkerInBounds_(marker,bounds)&&(!this.ignoreHidden_||this.ignoreHidden_&&marker.getVisible())&&this.addToClosestCluster_(marker);if(iLast<this.markers_.length)this.timerRefStatic=setTimeout(function(){cMarkerClusterer.createClusters_(iLast)},0);else for(delete this.timerRefStatic,google.maps.event.trigger(this,"clusteringend",this),i=0;i<this.clusters_.length;i++)this.clusters_[i].updateIcon_()}},MarkerClusterer.prototype.extend=function(obj1,obj2){return function(object){var property;for(property in object.prototype)this.prototype[property]=object.prototype[property];return this}.apply(obj1,[obj2])},MarkerClusterer.CALCULATOR=function(markers,numStyles){for(var index=0,title="",count=markers.length.toString(),dv=count;0!==dv;)dv=parseInt(dv/10,10),index++;return index=Math.min(index,numStyles),{text:count,index:index,title:title}},MarkerClusterer.BATCH_SIZE=2e3,MarkerClusterer.BATCH_SIZE_IE=500,MarkerClusterer.IMAGE_PATH="//cdn.rawgit.com/mahnunchik/markerclustererplus/master/images/m",MarkerClusterer.IMAGE_EXTENSION="png",MarkerClusterer.IMAGE_SIZES=[53,56,66,78,90],"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),module.exports=MarkerClusterer;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);

	var InfoWindow = (function (_google$maps$InfoWindow) {
	    function InfoWindow(options) {
	        _classCallCheck(this, InfoWindow);

	        _get(Object.getPrototypeOf(InfoWindow.prototype), 'constructor', this).call(this, objectAssign({}, options, { content: '' }));

	        this._content = options.content;
	    }

	    _inherits(InfoWindow, _google$maps$InfoWindow);

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
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            _get(Object.getPrototypeOf(InfoWindow.prototype), 'setContent', this).call(this, this.build(data));
	            _get(Object.getPrototypeOf(InfoWindow.prototype), 'open', this).apply(this, args);
	        }
	    }]);

	    return InfoWindow;
	})(google.maps.InfoWindow);

	module.exports = InfoWindow;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var objectAssign = __webpack_require__(6);

	var Marker = (function (_google$maps$Marker) {
	    function Marker(map, point, icon) {
	        _classCallCheck(this, Marker);

	        var marker = {
	            position: new google.maps.LatLng(point.latitude, point.longitude),
	            map: map
	        };

	        if (icon) {
	            objectAssign(marker, {
	                icon: icon
	            });
	        }

	        _get(Object.getPrototypeOf(Marker.prototype), 'constructor', this).call(this, marker);
	        this.id = point.id;
	    }

	    _inherits(Marker, _google$maps$Marker);

	    return Marker;
	})(google.maps.Marker);

	module.exports = Marker;

/***/ }
/******/ ]);