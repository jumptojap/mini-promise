import Promise from './promise.js'

const promise = new Promise((resolve, reject) => {
    // resolve('success')
    // throw new Error('error')
    // reject('error')
    setTimeout(() => {
        resolve('success')
    }, 1000)
})
// promise是一个类里面有三个状态
// 1.pending
// 2.fulfilled
// 3.rejected
// 状态一旦改变就不能再改变
// 状态改变后会执行then方法
// new Promise报错会执行reject方法
promise.then(res => {
    console.log(res)
}, err => {
    console.log(err)
})
promise.then(res => {
    console.log(res)
}, err => {
    console.log(err)
})