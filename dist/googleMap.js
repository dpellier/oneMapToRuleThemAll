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

	var GoogleMap = (function (_Map) {
	    function GoogleMap() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _classCallCheck(this, GoogleMap);

	        _get(Object.getPrototypeOf(GoogleMap.prototype), 'constructor', this).apply(this, args);
	        this.provider = 'Google Map';
	    }

	    _inherits(GoogleMap, _Map);

	    _createClass(GoogleMap, [{
	        key: 'render',
	        value: function render(loadingMask) {
	            // TODO loadingMask

	            var map = new google.maps.Map(this.domElement, this.options);
	            var bounds = new google.maps.LatLngBounds();

	            this.points.forEach(function (point) {
	                var marker = createMarker(google, map, point.latitude, point.longitude);
	                bounds.extend(marker.position);
	            });

	            map.fitBounds(bounds);
	        }
	    }, {
	        key: 'loadFiles',
	        value: function loadFiles(callback) {

	            // Add a global callback function to be called when google map script finish loading
	            window._googleMapCallbackOnLoad = function () {

	                // Remove callback to keep global clean
	                delete window._googleMapCallbackOnLoad;
	                callback();
	            };

	            var script = document.createElement('script');
	            script.type = 'text/javascript';
	            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=_googleMapCallbackOnLoad&key=' + this.apiKey;

	            this.domElement.appendChild(script);
	        }
	    }]);

	    return GoogleMap;
	})(Map);

	function createMarker(google, map, latitude, longitude) {
	    return new google.maps.Marker({
	        position: new google.maps.LatLng(latitude, longitude),
	        map: map
	    });
	}

	window.Map = GoogleMap;

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