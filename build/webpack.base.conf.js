var path = require('path')
var MpvuePlugin = require('webpack-mpvue-asset-plugin')
var genEntry = require('../lib-changed/mpvue-entry')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var webpack = require('webpack')

function resolve (dir) {
  return path.join(process.cwd(), dir)
}
/* changed*/
function resolveCurPath (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = function (options) {
  const { entry } = options
  return {
    entry: genEntry('./src/pages.js', entry),
    target: require('mpvue-webpack-target'),
    /* changed*/
    resolveLoader: {
      modules: [path.resolve(__dirname, '../node_modules'), path.resolve(process.cwd(), 'node_modules')]
    },
    /* changed*/
    output: {
      path: config.build.assetsRoot,
      filename: utils.assetsPath('js/[name].js'),
      chunkFilename: utils.assetsPath('js/[id].js'),
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue': 'mpvue',
        '@': resolve('src')
      },
      /* changed*/
      modules: [path.resolve(__dirname, '../node_modules'), path.resolve(process.cwd(), 'node_modules')],
      symlinks: false
    },

    module: {
      rules: [
        ...utils.styleLoaders({
          sourceMap: process.env.NODE_ENV !== 'production',
          extract: true
        }),
        {
          test: /\.vue$/,
          loader: 'mpvue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          /* changed*/
          include: [resolve('src'), resolve('test'), resolveCurPath('lib-changed/mpvue-entry')],
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: true,
                extends: path.resolve(__dirname, '../.babelrc')
              }
            },
            {
              loader: 'mpvue-loader',
              options: {
                checkMPEntry: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name]].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[ext]')
          }
        }
      ]
    },
    plugins: [
    /* changed*/
      new ExtractTextPlugin({
      // filename: utils.assetsPath('css/[name].[contenthash].css')
        filename: utils.assetsPath('css/[name].wxss')
      }),
      new MpvuePlugin(),
      /* changed*/
      new CopyWebpackPlugin([
        {
          from: path.resolve(process.cwd(), 'static'),
          to: path.resolve(process.cwd(), 'dist/static'),
          ignore: ['.*']
        }
      ]),
      /* changed*/
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf('node_modules') >= 0
          ) || count > 1
        }
      }),
      // extract webpack runtime and module manifest to its own file in order to
      // prevent vendor hash from being updated whenever app bundle is updated
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['vendor']
      }),

      // http://vuejs.github.io/vue-loader/en/workflow/production.html
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BASE_URL: '"/"',
        PLATFORM: JSON.stringify('mpvue'),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })

    ]
  }
}
