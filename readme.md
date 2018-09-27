## 功能
mpvue plugin for vue-cli 3.0

## 使用
```
npm i -g @vue/cli
```
```js
vue add vue-cli-plugin-mpvue
```
```js
npm run mpvue:dev
```

## 特性
1. 支持在vue.config.js 中创建 entry 入口，以及alias 别名
2. 支持命令行中传入入口,例如：
```
script:{
    "mpvue:dev": "vue-cli-service mpvue './src/entry/mpvue.js'",
    "mpvue:build": "vue-cli-service mpvue './src/entry/mpvue.js' --mode 'production'"
}
```
3. mpvue 官方中的demo中存在`src/pages.js`，此项目允许不存在此文件
则默认`src/pages.js`文件为pages文件夹下面的文件
```
[{
    path:'pages/a.vue'
}]
```

