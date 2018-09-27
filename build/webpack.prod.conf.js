var webpack = require('webpack')
var config = require('../config')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var merge = require('webpack-merge')

// const { toString } = require('webpack-chain')

// const output = toString(webpackConfig)

// console.log(output)

module.exports = function (options) {
  const baseConfig = require('./webpack.base.conf')(options)
  return merge(baseConfig, {

    devtool: config.build.productionSourceMap ? '#source-map' : false,

    plugins: [

      new UglifyJsPlugin({
        sourceMap: true
      }),

      new webpack.HashedModuleIdsPlugin()
    ]

  })
}

