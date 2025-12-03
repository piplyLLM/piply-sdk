const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'browser.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'PiplySDK',
    libraryTarget: 'umd',
  },
  mode: 'production',
};