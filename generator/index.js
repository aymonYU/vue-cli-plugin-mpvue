module.exports = (api, options) => {
  const pkg = {
    scripts: {
      "mpvue:dev": "vue-cli-service mpvue './src/mpvue.js'",
      "mpvue:build": "vue-cli-service mpvue './src/mpvue.js'  --mode 'production'"
    },
    dependencies: {
      mpvue: "^2.0.6"
    },
    devDependencies: {
      "vue-cli-plugin-mpvue": "^1.1.2"
    }
  };
  api.extendPackage(pkg);
  api.render("./template");
};
