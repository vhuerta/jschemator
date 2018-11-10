const path = require('path');

module.exports = {
  entry : './src/index.js',
  output: {
    library      : 'jschemator',
    libraryTarget: 'commonjs-module',
    filename     : 'index.js',
    path         : path.resolve(__dirname, 'dist')
  }
};
