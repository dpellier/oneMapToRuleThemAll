var path = require('path');

module.exports = {
    entry: ['./map/Map.js'],
    output: {
        filename: 'oneMapToRuleThemAll.js',
        path: path.join(__dirname, 'dist')
    }
};
