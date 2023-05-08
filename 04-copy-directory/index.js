const fs = require("fs")
const fsPromises = require("fs/promises")
const path = require("path")

const copyDir = async () => {
    await fsPromises.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, err => {
        if (err) {
            console.log(err)
        }
    })
    
    fs.mkdir(path.join(__dirname, "files-copy"), { recursive: true }, err => {
        if (err) {
            console.log(err)
        }
    })
    fs.readdir(path.join(__dirname, "files"), { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err)
        }
        for (const file of files) {
            fs.copyFile(path.join(__dirname, "files", file.name) ,path.join(__dirname, "files-copy", file.name), err => {
                console.log(err)
            })
        }
    })
}

copyDir()
