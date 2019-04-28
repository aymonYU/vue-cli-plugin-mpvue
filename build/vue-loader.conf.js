var utils = require("./utils");
var config = require("../config");
var path = require("path");
// var isProduction = process.env.NODE_ENV === 'production'
// for mp
var isProduction = true;

module.exports = {
  /* changed*/
  globalBabelrc: path.resolve(__dirname, "../.babelrc"),
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: "src",
    source: "src",
    img: "src",
    image: "xlink:href"
  },
  fileExt: config.build.fileExt
};
