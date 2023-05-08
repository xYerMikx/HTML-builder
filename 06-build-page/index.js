const fs = require("fs")
const fsPromises = require("fs/promises")
const path = require("path")

const assetsPath = path.join(__dirname, "assets"),
    componentsPath = path.join(__dirname, "components"),
    templatePath = path.join(__dirname, "template.html"),
    stylesPath = path.join(__dirname, "styles"),
    projectDirPath = path.join(__dirname, "project-dist"),
    distAssetsPath = path.join(projectDirPath, "assets"),
    distOutputCss = path.join(projectDirPath, "style.css"),
    distHtmlPath = path.join(projectDirPath, "index.html")

// copy and compile all html from components
const copyHTML = async () => {
    const writeHTML = fs.createWriteStream(distHtmlPath)
    const readTemplate = fs.createReadStream(templatePath)
    readTemplate.on("data", data => {
        writeHTML.write(data)
    })
}
const copyComponents = async () => {
    const writeHTML = fs.createWriteStream(distHtmlPath)
    const readTemplate = fs.createReadStream(templatePath)
    readTemplate.on("data", data => {
        let template = data.toString()
        fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.log(err)
            }
            files.forEach(file => {
                const currFile = path.join(componentsPath, file.name)
                if (path.extname(currFile) === ".html" && file.isFile()) {
                    const tempName = `{{${path.parse(file.name).name}}}`
                    fs.readFile(path.join(componentsPath, file.name), 'utf-8', (err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        template = template.replace(tempName, data)
                        fs.writeFile(distHtmlPath, template, err => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    })
                }
            })
        })
    })
}



// copy 
const copy = async (srcAssets, distAssets) => {
    const assets = await fsPromises.readdir(srcAssets, { withFileTypes: true })
    await fsPromises.mkdir(distAssets, { recursive: true })
    await fsPromises.rm(distAssets, { recursive: true })
    await fsPromises.mkdir(distAssets, { recursive: true })
    for (const asset of assets) {
        const srcPath = path.join(srcAssets, asset.name)
        const distPath = path.join(distAssets, asset.name)
        if (asset.isFile()) {
            await fsPromises.copyFile(srcPath, distPath)
        } else if (asset.isDirectory()) {
            await copy(srcPath, distPath)
        }
    }
}

// make css bundle

const copyStyles = async () => {
    fs.createWriteStream(distOutputCss)
    fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err)
        }
        for (const file of files) {
            const currFile = path.join(stylesPath, file.name)
            if (file.isFile() && path.extname(currFile) === '.css') {
                const readStream = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8')
                readStream.on("data", data => {
                    fs.appendFile(path.join(projectDirPath, 'style.css'), data + "\n", err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                })
            }
        }
    })
}



// make bundle 
(async () => {
    await copy(assetsPath, distAssetsPath)
    await copyStyles()
    await copyHTML()
    await copyComponents()
})()