var path = require("path");
var MpvuePlugin = require("webpack-mpvue-asset-plugin");
var genEntry = require("../lib-changed/mpvue-entry");
var utils = require("./utils");
var config = require("../config");
var vueLoaderConfig = require("./vue-loader.conf");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
var webpack = require("webpack");
var MpvueVendorPlugin = require("webpack-mpvue-vendor-plugin");

function resolve(dir) {
  return path.join(process.cwd(), dir);
}

module.exports = function(options) {
  const { entry } = options;
  console.log(genEntry("./src/pages.js", entry), "sedd");
  return {
    entry: genEntry("./src/pages.js", entry),
    target: require("mpvue-webpack-target"),
    /* changed*/
    resolveLoader: {
      modules: [
        path.resolve(__dirname, "../node_modules"),
        path.resolve(process.cwd(), "node_modules")
      ]
    },
    /* changed*/
    output: {
      path: config.build.assetsRoot,
      filename: utils.assetsPath("js/[name].js"),
      chunkFilename: utils.assetsPath("js/[id].js"),
      publicPath:
        process.env.NODE_ENV === "production"
          ? config.build.assetsPublicPath
          : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
      alias: {
        vue: "mpvue",
        "@": resolve("src")
      },
      /* changed*/
      modules: [
        path.resolve(__dirname, "../node_modules"),
        path.resolve(process.cwd(), "node_modules")
      ],
      symlinks: false
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "mpvue-loader",
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          include: [resolve("src"), resolve("test")],
          use: [
            "babel-loader",
            {
              loader: "mpvue-loader",
              options: Object.assign({ checkMPEntry: true }, vueLoaderConfig)
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: utils.assetsPath("img/[name].[ext]")
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: utils.assetsPath("media/[name]].[ext]")
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: utils.assetsPath("fonts/[name].[ext]")
          }
        }
      ]
    },
    plugins: [
      /* changed*/
      new ExtractTextPlugin({
        // filename: utils.assetsPath('css/[name].[contenthash].css')
        filename: utils.assetsPath("css/[name].wxss")
      }),
      new MpvuePlugin(),
      /* changed*/
      new CopyWebpackPlugin([
        {
          from: path.resolve(process.cwd(), "static"),
          to: path.resolve(process.cwd(), "dist/static"),
          ignore: [".*"]
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
        name: "vendor",
        minChunks: function(module, count) {
          // any required modules inside node_modules are extracted to vendor
          return (
            (module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf("node_modules") >= 0) ||
            count > 1
          );
        }
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        chunks: ["vendor"]
      }),

      // http://vuejs.github.io/vue-loader/en/workflow/production.html
      new webpack.DefinePlugin({
        mpvue: "global.mpvue",
        mpvuePlatform: "global.mpvuePlatform",
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BASE_URL: '"/"',
        PLATFORM: JSON.stringify("mpvue"),
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }),
      new MpvueVendorPlugin({
        platform: process.env.PLATFORM
      })
    ]
  };
};
