const { sync } = require('glob');
const fs = require('fs')
const path = require('path')
function getVuePages(){
    const pagesPath = path.resolve(process.cwd(), 'src/pages');	
    return sync(`${pagesPath}/**/*.vue`).map(item => path.relative(path.resolve(process.cwd(), 'src'), item).replace('.vue', ''))
}

exports.getEntry =  ()=>{
    const pages = getVuePages()
    const entry = {}
    const appJsonPath = path.resolve(process.cwd(), `src/app.json`)
    const appJson = Object.assign({pages},require(appJsonPath))
    fs.writeFileSync(appJsonPath,JSON.stringify(appJson))
    pages.forEach(page=>{
        const strTemplate = String(fs.readFileSync(path.resolve(__dirname,'./template/page.template.js')))
        const repalceStr = strTemplate.replace(/\$\{pagePath\}/g,page)
        const tempName = page.replace('/','_')
        const tempPath = path.resolve(process.cwd(), `src/.temp/${tempName}.js`);	
        fs.writeFileSync(tempPath,repalceStr)
        entry[page] = tempPath
    })
    return entry
}