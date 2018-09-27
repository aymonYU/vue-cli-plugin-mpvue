const fs = require('fs');
const path = require('path');
const glob = require('glob');

/* changed */
/**
 * 遍历整个 src/pages 目录，查找 .vue 文件,支持两层结构的目录
 * @return {[type]}        [description]
 */
function getVuePages() {
  const pagesPath = path.resolve(process.cwd(), 'src/pages');

  return glob.sync(`${pagesPath}/**/*.vue`).map(item => ({ path: path.relative(path.resolve(process.cwd(), 'src'), item).replace('.vue', '') }));
}

// 项目内文件绝对路径获取函数
/* changed */
function resolveApp(dir) {
  // return path.join(path.dirname(require.main.filename), '..', dir);
  return path.resolve(process.cwd(), dir);
}

// 输出文件绝对路径获取函数
function resolveModule(dir) {
  return path.join(__dirname, '..', dir);
}

// 文件写入函数
function writeFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// 配置对比函数
function isConfigChanged(page, oldPages) {
  // 获取备份的页面索引
  const oldPageIndex = oldPages.findIndex(oldPage => oldPage.path === page.path);

  // 不存在备份配置说明为新增页面
  if (oldPageIndex === -1) return true;

  // 获取并移除备份的页面配置
  const oldPage = oldPages.splice(oldPageIndex, 1)[0];

  // 对比新旧配置的键
  const keys = Object.keys(page.config || {});
  const oldKeys = Object.keys(oldPage.config || {});

  if (keys.length !== oldKeys.length) return true;

  // 对比新旧配置的值
  return keys.some(key => page.config[key] !== oldPage.config[key]);
}

function genEntry(...arg) {
  // 获取各文件的绝对路径
  const pagesPath = resolveApp(arg[0]);
  const bakPagesPath = resolveModule('./dist/pages.bak.js');
  const templatePath = resolveApp(arg[1] || './src/main.js');
  const bakTemplatePath = resolveModule('./dist/template.bak.js');

  // 获取所有新旧页面的配置
  /* changed */
  // 如果没有pages.js的话，分析pages文件夹中文件
  let pages = fs.existsSync(pagesPath) ? require(pagesPath) : getVuePages();
  let oldPages = fs.existsSync(bakPagesPath) ? require(bakPagesPath) : [];
  if (!Array.isArray(pages)) pages = [];
  if (!Array.isArray(oldPages)) oldPages = [];

  // 清除 require 缓存
  require.cache[pagesPath] = null;
  require.cache[bakPagesPath] = null;

  // 获取新旧入口文件模板
  let template = String(fs.readFileSync(templatePath)).replace(/\n*.*mpType.*\n*/, '\n\n');
  const bakTemplate = fs.existsSync(bakTemplatePath) ? String(fs.readFileSync(bakTemplatePath)) : '';

  const mixinReg = /\n*Vue\.mixin(.*).*\n*/;
  while (mixinReg.test(template)) {
    // 去除 mixin 混入语句
    template = template.replace(mixinReg, '\n\n')
      // 去除 mixin 文件导入语句
      .replace(new RegExp(`\n*import ${RegExp.$1 || null}.*\n*`), '\n\n');
  }

  const isTemplateChanged = template !== bakTemplate;

  // 创建入口配置对象
  const entry = { app: templatePath };

  // 生成入口文件的队列
  const queue = pages.map((page) => {
    // 页面路径
    const pagePath = page.path.replace(/^\//, '');

    // 页面配置
    const pageConfig = JSON.stringify({ config: page.config });

    // 入口文件的文件名
    const fileName = page.name || pagePath.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase());

    // 入口文件的完整路径
    const entryPath = resolveModule(`./dist/${fileName}.js`);

    entry[pagePath] = entryPath;

    if (isTemplateChanged || isConfigChanged(page, oldPages)) {
      // 生成入口文件
      return writeFile(entryPath, template
        .replace(/import App from .*/, `import App from '@/${pagePath}'`)
        .replace(/export default ?{[^]*}/, `export default ${pageConfig}`));
    }

    return Promise.resolve();
  });

  // 备份文件
  Promise.all(queue).then(() => {
    // 备份页面配置文件
    if (fs.existsSync(pagesPath)) {
      const configReadStream = fs.createReadStream(pagesPath);
      const configWriteStream = fs.createWriteStream(bakPagesPath);

      configReadStream.pipe(configWriteStream);
    } else {
      fs.writeFileSync(bakPagesPath, JSON.stringify(getVuePages()));
    }
    // 备份入口模板文件
    writeFile(bakTemplatePath, template);
  });

  // 监听文件
  if (fs.existsSync(pagesPath)) fs.watch(pagesPath, { persistent: false }, () => genEntry(...arg));
  fs.watch(templatePath, { persistent: false }, () => genEntry(...arg));

  return entry;
}

module.exports = genEntry;
