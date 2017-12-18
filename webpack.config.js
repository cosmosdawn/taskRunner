var path = require("path");
module.exports = {
    entry: './src/jsdev/index.js',
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: 'bundle.js'
    }
}