var webpack = require('webpack')
var merge = require('webpack-merge')

var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = function (options) {
  const baseConfig = require('./webpack.base.conf')(options)
  return merge(baseConfig, {

    // cheap-module-eval-source-map is faster for development
    // devtool: '#cheap-module-eval-source-map',
    devtool: '#source-map',

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new FriendlyErrorsPlugin()
    ]
  })
}
