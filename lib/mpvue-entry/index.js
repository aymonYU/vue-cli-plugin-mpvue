const { sync } = require('glob');
// const { format } = require('json-string-formatter');
const fs = require('fs')
const path = require('path')
function getVuePages(){
    const pagesPath = path.resolve(process.cwd(), 'src/pages');	
    return sync(`${pagesPath}/**/*.vue`).map(item => path.relative(path.resolve(process.cwd(), 'src'), item).replace('.vue', ''))
}

exports.getEntry =  ()=>{
    const pages = getVuePages()
    const entry = {}
    // const appJsonPath = path.resolve(process.cwd(), `src/app.json`)
    // delete require.cache[require.resolve(appJsonPath)];
    // const appJsonRequired = require(appJsonPath)
    // const lastAppJson = JSON.stringify(appJsonRequired)
    // const appJson = Object.assign(appJsonRequired,{pages})
    // const megedAppJson = JSON.stringify(appJson)
    // if(megedAppJson!==lastAppJson){
    //     const output = format(megedAppJson)
    //     fs.writeFileSync(appJsonPath,output)
    // }
    if(!fs.existsSync(path.resolve(process.cwd(),'src/.temp'))){
        fs.mkdirSync(path.resolve(process.cwd(),'src/.temp'))
    }
    pages.forEach(page=>{
        const strTemplate = String(fs.readFileSync(path.resolve(__dirname,'./template/page.template.js')))
        const repalceStr = strTemplate.replace(/\$\{pagePath\}/g,page)
        const tempName = page.replace(/\//g,'_')
        const tempPath = path.resolve(process.cwd(), `src/.temp/${tempName}.js`);	
        fs.writeFileSync(tempPath,repalceStr)
        entry[page] = tempPath
    })
    return entry
}