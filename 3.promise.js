//判断成功和失败函数的返回结果
//如果返回一个普通值，会传递给下一个then
//如果返回一个promise，会等待这个promise执行完成
//如果返回一个pending状态的promise，会等待这个promise执行完成
//如果抛出一个错误，会传递给下一个then的失败回调
import Promise from './promise.js'

// let promise = new Promise((resolve, reject) => {
//     resolve('success')
// })
// promise.then(res => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     resolve('success2')
//                 }, 1000)
//             }))
//         }, 1000)
//     })
// }).then(res => {
//     console.log(res)
// }, err => {
//     console.log(err)
// })
// Promise.resolve(new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve('success2')
//             }, 1000)
//         }))
//     }, 1000)
// })).then(res => {
//     console.log(res)
// })


// Promise.all([new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success')
//     }, 1000)
// }), new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success2')
//     }, 1000)
// }), 2, new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 resolve('success3')
//             }, 1000)
//         }))
//     }, 1000)
// })]).then(res => {
//     console.log(res)
// }, err => {
//     console.log("error", err)
// })
// Promise.race([new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success')
//     }, 2000)
// }), new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('error')
//     }, 1000)
// })]).then(res => {
//     console.log(res)
// }, err => {
//     console.log("error", err)
// })
// Promise.allSettled([new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success')
//     }, 1000)
// }), new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('error')
//     }, 1000)
// })]).then(res => {
//     console.log(res)
// }, err => {
//     console.log("error", err)
// })
Promise.any([new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('error')
    }, 1000)
}), new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('error')
    }, 1000)
})]).then(res => {
    console.log(res)
}, err => {
    console.log("error", err)
})