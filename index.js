const webpack = require('webpack')
const config = require('./config')
const merge = require('webpack-merge')
var rm = require('rimraf')

module.exports = (api, options) => {
  // if (options.pluginOptions.platform === 'mpvue')
  api.chainWebpack(async (configChain, options = {}) => {
    configChain.resolve.alias.delete('vue$')
    configChain.resolve.alias.set('vue', 'mpvue')

    // 删除无用的配置
    configChain.module.rules.delete('vue')
    // configChain.module.rules.delete('images')
    // configChain.module.rules.delete('svg')
    // configChain.module.rules.delete('media')
    // configChain.module.rules.delete('fonts')
    configChain.module.rules.delete('pug')
    configChain.module.rules.delete('css')
    configChain.module.rules.delete('postcss')
    configChain.module.rules.delete('scss')
    configChain.module.rules.delete('sass')
    configChain.module.rules.delete('less')
    configChain.module.rules.delete('stylus')
    configChain.module.rules.delete('js')
    configChain.module.rules.delete('eslint')
    configChain.plugins.delete('vue-loader')
    configChain.plugins.delete('define')
    configChain.plugins.delete('case-sensitive-paths')
    configChain.plugins.delete('hmr')
    configChain.plugins.delete('progress')
    configChain.plugins.delete('html')
    configChain.plugins.delete('preload')
    configChain.plugins.delete('prefetch')
    configChain.plugins.delete('friendly-errors')

    // production
    configChain.plugins.delete('extract-css')
    configChain.plugins.delete('optimize-css')
    configChain.plugins.delete('hash-module-ids')
    configChain.plugins.delete('named-chunks')
})
  api.registerCommand(
    'mpvue',
    {
      description: 'use mpvue loader',
      usage: 'vue-cli-service mpvue [options] [entry]',
      options: {
        '--mode': `specify env mode (default: development)`
      }
    },
    async args => {
      if (args.mode === 'production') {
        process.env.NODE_ENV = 'production'
      }
      const isProduction = process.env.NODE_ENV === 'production'

      let webpackConfig = {}

      if (isProduction) {
        await rm(config.build.assetsRoot, err => {
          if (err) throw err
        })
        webpackConfig = require('./build/webpack.prod.conf.js')({entry: args._[0]})
      } else {
        webpackConfig = require('./build/webpack.dev.conf.js')({entry: args._[0]})
      }
      const vueCliConfig = api.resolveWebpackConfig()
      delete vueCliConfig['optimization']
      delete vueCliConfig['entry']
      delete vueCliConfig['mode']
      delete vueCliConfig['output']
      delete vueCliConfig['devtool']
      // delete vueCliConfig['resolveLoader']
      
      // 合并从配置中读取的配置结果
      webpackConfig =  merge.smart(webpackConfig,vueCliConfig)
 
      // 由于mpvue 还是用webpack3，这里只能这样处理
      const compile = webpack(webpackConfig, function (err, stats) {
        if (err) throw err
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n')
      })
      if (!isProduction) {
        require('./build/server')(compile, webpackConfig)
      }
    }

  )

}

