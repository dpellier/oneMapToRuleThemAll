var path = require('path');

module.exports = {
    entry: {
        baidu: './src/providers/baidu/baidu.js',
        bingMap: './src/providers/bingMap/BingMap.js',
        googleMap: './src/providers/googleMap/GoogleMap.js',
        viaMichelin: './src/providers/viaMichelin/ViaMichelin.js',
        yandex: './src/providers/yandex/Yandex.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}
        ],
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    jshint: {
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        freeze: true,
        immed: true,
        indent: 4,
        latedef: 'nofunc',
        maxcomplexity: 8,
        maxdepth: 4,
        newcap: true,
        noarg: true,
        noempty: true,
        nonbsp: true,
        nonew: true,
        quotmark: 'single',
        strict: true,
        undef: true,
        unused: true,
        varstmt: true,

        // Relaxing options
        eqnull: true,
        esnext: true,
        globalstrict: true,

        // Environments
        browser: true,
        globals: {
            BMap: true,
            BMapLib: true,
            console: true,
            google: true,
            MarkerClusterer: true,
            Microsoft: true,
            PinClusterer: true,
            ViaMichelin: true,
            VMLaunch: true,
            ymaps: true
        }
    }
};
