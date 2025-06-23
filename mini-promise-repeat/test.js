// Promise.reject(1).finally(() =>{
//     console.log("结束");
//     throw new Error("错误")
// }).catch(err => {
//     console.log("err", err);

// })
// let Promise = require("./promise.js")
// Promise.race([new Promise((resolve, reject) => {
//     setTimeout(() => reject(1), 2000)
// }),new Promise((resolve) => {
//     setTimeout(() => resolve(100), 3000)
// })]).then(res => {
//     console.log("res", res);
    
// }, err => {
//     console.log("err", err);
    
// })
// new Promise((resolve, reject) => {
//     reject(new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(1000)
//         }, 1000)
//     }))
// }).then(res => {
//     console.log(res);
// })
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {

        resolve(promise)
    }, 0)
})