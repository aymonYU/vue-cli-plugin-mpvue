var webpack = require('webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var merge = require('webpack-merge')

module.exports = function (options) {
  const baseConfig = require('./webpack.base.conf')(options)
  return merge(baseConfig, {

    devtool: false,

    plugins: [

      new UglifyJsPlugin({
        sourceMap: true
      }),

      // new webpack.HashedModuleIdsPlugin()
    ]

  })
}

