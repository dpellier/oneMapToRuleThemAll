# One Map To Rule Them All
---

The goal of this tiny lib is to offer a common interface to allow basic usage of multiple map providers.

The only thing that change will be the configuration you pass to the Map constructor. All your map interaction logic will stay the same regardless of the provider chosen.

The lib use the native provider configuration voluntarily to allow integrators to use directly the options and functionalities of each provider.

<img src="http://i.imgur.com/1GuEBnv.png" height="400" />

## Getting Started

Include the script corresponding to the provider you want:
```html
<script src="oneMapToRuleThemAll/dist/googleMap.js"></script>
```

Providers available:
- googleMap
- bingMap
- baidu
- mappy
- yandex
- viaMichelin

Each file can be included with its minified version by inserting the `.min.js` file. 


## Usage

Each provider expose the same set of methods, that will call the corresponding action using the provider native way.


### constructor(selector, apiKey, locale, options, plugins)

Create a new Map instance.

#### selector
Type: `DOM Element`

The DOM container where the map will be added.

#### apiKey
Type: `String`

Provider API Key that will be used to request the API.

### locale
Type: `String`

Specific locale to use when loading the Map.

#### options
Type: `Object`

see [setOptions method](https://github.com/dpellier/oneMapToRuleThemAll#setoptionsoptions)

#### plugins
Type: `Object`

List of external plugins to use. It depends on each provider (see [provider plugins](https://github.com/dpellier/oneMapToRuleThemAll#provider-plugins))

#### Example
```js
var map = new Map(document.querySelector('#map'), providerKey, {}, {
    clusterer: true
});
```


### setPoints(points)

Set the list of point you want to display on the map.

#### points
Type: `Object || Array`

All the points you want to display on the map. Each point must at least contain latitude and longitude properties.

```js
{
    latitude: 45.564601,
    longitude: 5.917781,
    id: 'uuid1'              // you can add an id if you want to interact with the point later
    data: {
        // you can add custom data to interact with the point
    }
}
```

### setOptions(options)

Set the custom options to configure your map.

#### options
Type: `Object`

The options are separated into common groups for each provider, but the properties inside each group are the native ones of the provider.
Here are the common options:

```js
{
    activeCluster: true || false,       // set if the marker should be clustered or not
    activeInfoWindow: true || false,    // set if an info window will be displayed on active point
    map: {
        // Put here all the map configuration relative to the chosen provider
    },
    marker: {
        // Put here all the marker configuration relative to the chosen provider
    },
    markerCluster: {
        // Put here all the clusterer configuration relative to the chosen provider
    },
    infoWindow: {
        // If not directly inside the marker properties, put here the template to render for the info window
    }
}
```

#### Examples
- [Google config](https://developers.google.com/maps/documentation/javascript/reference)

```js
{
    activeCluster: true,
    activeInfoWindow: true,
    map: {
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        panControl: false,
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        }
    },
    marker: {
        icon: {
            url: './marker.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
        },
        label: function(point) {
            return '<div class="map-custom-label">' + point.id + '</div>';
        }
    },
    markerCluster: {
        averageCenter: true,
        styles: [{
            url: './marker.png',
            height: 34,
            width: 28,
            anchor: [0, 32]
        }]
    },
    infoWindow: {
        content: function(data) {
            return '<p>' + JSON.stringify(data) + '</p>';
        }
    }
}
```

- [Bing config](https://www.bingmapsportal.com/isdk/ajaxv7e)

```js
{
    activeCluster: true,
    activeInfoWindow: true,
    map: {
        disableBirdseye: true,
        enableClickableLogo: false,
        enableSearchLogo: false,
        showCopyright: false,
        showMapTypeSelector: false,
        showScalebar: false
    },
    marker: {
        icon: './marker.png',
        anchor:new Microsoft.Maps.Point(0, 32),
        height: 34,
        width: 28,
        text: function(point) {
            return point.id.toString();
        }
    },
    markerCluster: {
        icon: './marker.png',
        anchor:new Microsoft.Maps.Point(0, 32),
        height: 34,
        width: 28
    },
    infoWindow: {
        description: function(data) {
            return '<p>' + JSON.stringify(data) + '</p>';
        },
    }
}
```

- [Baidu config](http://developer.baidu.com/map/index.php?title=jspopular)

```js
{
    activeCluster: true,
    activeInfoWindow: true,
    map: {
        enableScrollWheelZoom: true
    },
    marker: {
        icon: new BMap.Icon('./marker.png', new BMap.Size(28, 34)),
        offset: new BMap.Size(14, -20)
    },
    markerLabel: {
        content: function(point) {
            return point.id.toString();
        },
        options: {
            offset: new BMap.Size(5, 5)
        },
        style: {
            backgroundColor: 'transparent',
            border: 'none'
        }
    },
    markerCluster: {
        style: {
            url: './marker.png',
            size: new BMap.Size(28, 34),
            opt_anchor: [14, -20]
        }
    },
    infoWindow: {
        offset: new BMap.Size(14, -34),
        message: function(data) {
            return '<p>' + JSON.stringify(data) + '</p>';
        }
    }
}
```

- [Mappy config](http://leafletjs.com/reference.html)

```js
{
    {
        activeCluster: true,
        activeInfoWindow: true,
        map: {
            clientId: mappyKey,
            layersControl: false,
            zoom: 7
        },
        marker: {
            icon: L.icon({
                iconUrl: './marker.png'
            })
        },
        markerCluster: {
            iconCreateFunction: function(cluster) {
                return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
            }
        },
        infoWindow: {
            content: function(data) {
                return bigDOM(data);
            }
        }
    }
}
```

- [Yandex config](https://tech.yandex.ru/maps/jsapi/)

```js
{
    activeCluster: true,
    activeInfoWindow: true,
    map: {
        center: [0, 0],
        zoom: 10
    },
    marker: {
        options: {
            iconLayout: 'default#imageWithContent',
            iconImageHref: './marker.png',
            iconImageOffset: [0, -32],
            iconImageSize: [28, 34],
            openEmptyBalloon: true,
            hideIconOnBalloonOpen: false,
            balloonOffset: [16, -32]
        },
        properties: {
            iconContent: function(point) {
                return point.id;
            },
            balloonContent: function(data) {
                return '<p>' + JSON.stringify(data) + '</p>';
            }
        }
    },
    markerCluster: {
        hasBalloon: false,
        clusterIconLayout: 'default#imageWithContent',
        clusterIconImageHref: './marker.png',
        clusterIconImageOffset: [0, -32],
        clusterIconImageSize: [28, 34]
    }
}
```

- [ViaMichelin config](http://dev.viamichelin.fr/tutoriel-rest.html)

```js
{
    activeCluster: true,
    activeInfoWindow: true,
    map: {
        center: {coords: {lon: 5.922, lat: 45.566}},
        zoom: 16,
        mapTypeControl: true,
        situationMapControl: true
    },
    marker: {
        icon: {
            url: './marker.png',
            offset: {
                x: 0,
                y: -32
            }
        },
        htm: function(data) {
            return '<p>' + JSON.stringify(data) + '</p>';
        },
        overlayText: {
            text: function(point) {
                return '<div>' + point.id + '</div>';
            }
        }
    },
    markerCluster: {
        styles: [{
            url: './marker.png',
            size:{
                height: 34,
                width: 28
            }
        }]
    }
}
```

### render

Display the map with all the given points and bind the configured events.

Currently, each point click event is bind to the toggling of the info window.

### load(callback, loadingMask, clustered)

Each provider scripts are loaded asynchronously when needed.
So before rendering the map, you'll have to call the load method to fetch all the needed resources.

In the load callback, you'll get access to the provider object (ex: `google.maps`), so you will have to set your options at this moment if you use some of this (ex: `google.maps.ControlPosition.TOP_RIGHT`)

#### callback
Type: `Function`

Function to call when all the provider resources are loaded

#### loadingMask
Type: `Boolean`

If set to true, a loader will be added to the map container during the loading of all the resources.

The loader style can be customized by overriding the `one-map-to-rule-them-all__spinner` class.

#### clustered
Type: `Boolean`

As many provider use external scripts to manage the clustering, we load them only if they are required.

Set this to true to load the clusterer resources.

#### Example

```js
var map = new Map('#map', key);
map.setPoints([...]);

map.load(function() {
    map.setOptions(getMapConfig());
    map.render();
}, true, true);
```

### clickOnMarker(markerId)

Trigger a click on the point with the given id (if your point have a id property).

#### markerId
Type: `String || Number`

Id of the marker to trigger the click event on.

### getDirections(origin, destination, options, callback, onError)

Get the direction to go between two points, it can return the provider raw data or the provider formatted road map.

#### origin
Type: `String`

Starting address.

#### destination
Type: `String`

Arriving address.

#### options
Type: `Object`

Customize the direction request and result.

```js
{
    panelSelector: ...      // Set the id of a DOM Element here if you want the native formatted road map to be displayed
    region: ...             // Set this if you want a more specific direction search request
}
```

#### callback
Type: `Function`

Function to call when the request is completed.
Will receive all the raw data from the provider as argument.

#### onError
Type: `Function`

Function to call when the request failed.


#### Example
```js
var map = new Map('#directionsMap', key);

map.load(function() {

    map.getDirections('Paris', 'Lyon', {
        panelSelector: '#directions'
        region: 'fr'
    }, function(res) {
        // res contain all the direction data from the provider
    });

}, true, false);
```

## Compatibility
| | Google Map | Bing Map | Baidu | Mappy | Yandex | ViaMichelin |
|-----|:----------:|:--------:|:-----:|:-----:|:------:|:-----------:|
| Chrome | OK | OK | OK | OK | OK | OK |
| Firefox | OK | OK | OK | ? | OK | ? |
| Opera | OK | OK | OK | ? | OK | OK |
| Safari | OK | OK | OK | ? | OK | ? |
| IE11 | OK | OK | OK | ? | OK | ? |
| IE10 | OK | OK | OK | ? | OK | ? |
| IE9 | OK | OK | OK | ? | OK | ? |
| IE8* | OK | KO | OK | ? | OK | ? |

* need to include [es5-shim && es5-sham](https://github.com/es-shims/es5-shim)

## Provider Plugins

### Google Map

clusterer: markerclusterer.min.js

infobox: https://github.com/googlemaps/js-info-bubble

### Bing Map

clusterer: http://rtsinani.github.io/PinClusterer/

### Baidu

clusterer: API Baidu (TextIconOverlay && MarkerClusterer)

### Mappy

clusterer: https://github.com/Leaflet/Leaflet.markercluster/tree/leaflet-0.7
