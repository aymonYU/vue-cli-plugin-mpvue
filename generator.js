module.exports = (api, options) => {
  const pkg = {
    scripts: {
      'mpvue:dev': 'vue-cli-service mpvue',
      'mpvue:build': "vue-cli-service mpvue  --mode 'production'"
    },
    dependencies: {
      'mpvue': '^1.0.13'
    },
    devDependencies: {
      'vue-cli-plugin-mpvue': '^1.0.12'
    }
  }
  api.extendPackage(pkg)
}
