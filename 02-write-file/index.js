const fs = require("fs")
const { stdin, stdout } = process
const path = require("path")
const readline = require("readline")

const filePath = path.join(__dirname, 'text.txt')
const readableStream = fs.createWriteStream(filePath)
const rl = readline.createInterface({ input: process.stdin })

const exit = () => {
    rl.close()
    console.log("Goodbye")
}

stdout.write("Enter text:" + "\n")
rl.on("line", (input) => {
    if (input.trim() === 'exit') exit();
    readableStream.write(input + "\n")
})

process.on("SIGINT", exit)