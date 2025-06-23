const Promise = require('./promise.js')

new Promise((resolve, reject) => {
    resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1000)
        }, 1000)
    }))
}).then(res => {
    console.log('结果:', res);
}) 