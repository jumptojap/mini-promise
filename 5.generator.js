let co = require("./co.js")
let fs = require("fs")
function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}
function* read(){
    try{
        let a = yield Promise.resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1)
            }, 1000)
        }))
        let b = yield Promise.resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(2)
            }, 1000)
        }))
        let c = yield Promise.resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(3)
            }, 1000)
        }))
        let d = yield readFile("./c.txt")
        console.log(d)
        return a + b + c + d
    }catch(e){
        console.log("内部错误", e)
        let f = yield Promise.resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("error")
            }, 1000)
        }))
        console.log(f)
    }
}
co(read).then(res => {
    console.log("结果", res)
}).catch(err => {
    console.log("外部错误", err)
})