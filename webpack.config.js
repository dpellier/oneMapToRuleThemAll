const path = require('path');
const LoaderOptionsPlugin = require('webpack').LoaderOptionsPlugin;
module.exports = {
    entry: {
        baidu: './src/providers/baidu/baidu.js',
        bingMap: './src/providers/bingMap/BingMap.js',
        googleMap: './src/providers/googleMap/GoogleMap.js',
        mappy: './src/providers/mappy/Mappy.js',
        openStreetMap: './src/providers/openStreetMap/openStreetMap.js',
        viaMichelin: './src/providers/viaMichelin/ViaMichelin.js',
        yandex: './src/providers/yandex/Yandex.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    plugins: [
       new LoaderOptionsPlugin({ options: {} })
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre",
                loader: "jshint-loader",
                options: {
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
                        BMAP_STATUS_SUCCESS: true,
                        console: true,
                        google: true,
                        L: true,
                        MarkerClusterer: true,
                        Microsoft: true,
                        PinClusterer: true,
                        ViaMichelin: true,
                        VMLaunch: true,
                        ymaps: true,
                        window: true,
                        ol: true,
                    }
                },
            },
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test:/\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
