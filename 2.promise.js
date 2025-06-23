import fs from 'fs'
// 回调地狱，代码结构丑难以维护 错误处理每一层都要处理
// fs.readFile('./a.txt', 'utf-8', (err, data) => {
//     if(err) throw err
//     fs.readFile(data, 'utf-8', (err, data) => {
//         if(err) throw err
//         console.log(data)
//     })
// })
function readFile(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}
//如果一个promise的then方法返回一个promise，那么这个promise会等待这个promise执行完成
//并且采用他的状态，如果成功会将成功的结果向外层的下一个then传递
readFile('./a.txt').then(res => {
    return readFile(res)
}).then(res => {
    console.log(res)
    //如果返回一个普通值，会将这个普通值传递给下一个then
    //如果抛出一个错误，会传递给下一个then的失败回调
    // throw new Error('error')
    // 如果返回一个pending状态的promise，那么会等待这个promise执行完成
    return new Promise(() => {})
}, err => {
    console.log(err)
}).then(res => {
    console.log(res)
}, err => {
    console.log(`err:${err}`)
})
//只有两种情况会失败，1.抛出错误 2.返回一个失败的promise
//每次执行then方法都会返回一个新的promise