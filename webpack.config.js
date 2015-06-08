var path = require('path');

module.exports = {
    entry: {
        bingMap: "./src/providers/bingMap/BingMap.js",
        googleMap: "./src/providers/googleMap/GoogleMap.js",
        leaflet: "./src/providers/leaflet/Leaflet.js"
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, 'dist')
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};
