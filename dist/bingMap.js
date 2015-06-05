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

	var BingMap = (function (_Map) {
	    function BingMap() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _classCallCheck(this, BingMap);

	        _get(Object.getPrototypeOf(BingMap.prototype), 'constructor', this).apply(this, args);
	        this.provider = 'Bing Map';
	    }

	    _inherits(BingMap, _Map);

	    _createClass(BingMap, [{
	        key: 'render',
	        value: function render(loadingMask) {
	            // TODO loadingMask

	            var map = new Microsoft.Maps.Map(this.domElement, { credentials: this.apiKey });

	            if (this.points.length > 1) {

	                var locations = this.points.map(function (point) {
	                    var loc = new Microsoft.Maps.Location(point.latitude, point.longitude);
	                    var pin = new Microsoft.Maps.Pushpin(loc);
	                    map.entities.push(pin);

	                    return loc;
	                });

	                var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(locations);
	                map.setView({ bounds: viewBoundaries });
	            } else {

	                var loc = new Microsoft.Maps.Location(this.points[0].latitude, this.points[0].longitude);
	                var pin = new Microsoft.Maps.Pushpin(loc);

	                map.entities.push(pin);
	                map.setView({ center: loc, zoom: 10 });
	            }
	        }
	    }, {
	        key: 'loadFiles',
	        value: function loadFiles(callback) {
	            // Add a global callback function to be called when bing script finish loading
	            window._bingCallbackOnLoad = function () {

	                // Remove callback to keep global clean
	                delete window._bingCallbackOnLoad;
	                callback();
	            };

	            var script = document.createElement('script');
	            script.setAttribute('src', 'http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onScriptLoad=_bingCallbackOnLoad');
	            script.setAttribute('type', 'text/javascript');
	            this.domElement.appendChild(script);
	        }
	    }]);

	    return BingMap;
	})(Map);

	window.Map = BingMap;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Map = (function () {
	    function Map(domElement, apiKey, options) {
	        _classCallCheck(this, Map);

	        this.domElement = domElement;
	        this.apiKey = apiKey;
	        this.options = options || {};
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
	            this.options = options;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            console.log(this.provider + ' has no render method implemented');
	        }
	    }, {
	        key: 'loadFiles',
	        value: function loadFiles() {
	            console.log(this.provider + ' has no loadFiles method implemented');
	        }
	    }]);

	    return Map;
	})();

	module.exports = Map;

/***/ }
/******/ ]);