const PENDING = "pending"
const FULLFILLED = "fullfilled"
const REJECTED = "rejected"
class Promise{
    state
    reason
    value
    onFulfilledCallbacks = []
    onRejectedCallbacks = []
    constructor(executor){
        this.state = PENDING
        const resolve = res => {
            if(this.state === PENDING){
                this.state = FULLFILLED
                this.value = res
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }
        const reject = err => {
            if(this.state === PENDING){
                this.state = REJECTED
                this.reason = err
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFullfilled, onRejected){
        onFullfilled = typeof onFullfilled === "function" ? onFullfilled : value => value
        onRejected = typeof onRejected === "function" ? onRejected : reason => {throw reason}
        //返回一个promise，结果由onFullfilled或onRejected决定
        const promise = new Promise((resolve, reject) => {
            if(this.state === FULLFILLED){
                setTimeout(() => {
                    try{
                        const res = onFullfilled(this.value)
                        // 如果返回的是一个promise，则需要递归解析
                        resolvePromise(promise, res, resolve, reject)
                    }catch(error){
                        reject(error)
                    }
                }, 0)
            }else if(this.state === REJECTED){
                setTimeout(() => {
                    try{
                        const res = onRejected(this.reason)
                        resolvePromise(promise, res, resolve, reject)
                    }catch(error){
                        reject(error)
                    }
                }, 0)
            }else{
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            const res = onFullfilled(this.value)
                            resolvePromise(promise, res, resolve, reject)
                        }catch(error){
                            reject(error)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            const res = onRejected(this.reason)
                            resolvePromise(promise, res, resolve, reject)
                        }catch(error){
                            reject(error)
                        }
                    }, 0)
                })
            }
        })
        return promise
    }
    catch(onRejected){
        return this.then(null, onRejected)
    }
    finally(onFinally){
        return this.then(res => {
            onFinally()
            return res
        }, err => {
            onFinally()
            throw err
        })
    }
    static resolve(value){
        return new Promise((resolve, reject) => {
            // 利用 resolvePromise 处理各种类型的 value
            resolvePromise(null, value, resolve, reject)
        })
    }
    static reject(reason){
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
    static all(promises){
        return new Promise((resolve, reject) => {
            let result = []
            let count = 0
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(res => {
                    result[index] = res
                    count++
                    if(count === promises.length){
                        resolve(result)
                    }
                }, err => {
                    reject(err)
                })
            })
        })
    }
    static race(promises){
        return new Promise((resolve, reject) => {
            promises.forEach(promise => {
                Promise.resolve(promise).then(resolve, reject)
            })
        })
    }
    static allSettled(promises){
        return new Promise((resolve, reject) => {
            let result = []
            let count = 0
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(res => {
                    result[index] = {status: "fulfilled", value: res}
                    count++
                    if(count === promises.length){
                        resolve(result)
                    }
                }, err => {
                    result[index] = {status: "rejected", reason: err}
                    count++
                    if(count === promises.length){
                        resolve(result)
                    }
                })
            })
        })
    }
    static any(promises){
        return new Promise((resolve, reject) => {
            let count = 0
            let errors = []
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(res => {
                    resolve(res)
                }, err => {
                    errors[index] = err
                    count++
                    if(count === promises.length){
                        reject(new AggregateError(errors, "All promises were rejected"))
                    }
                })
            })
        })
    }
}
function resolvePromise(promise, res, resolve, reject){
    if(promise === res){
        return reject(new TypeError("Chaining cycle detected for promise"))
    }
    if(typeof res === "function" || (typeof res === "object" && res !== null)){
        let called = false
        try{
            const then = res.then //then可能用Object.defineProperty定义，所以需要try catch
            if(typeof then === "function"){
                //then是函数，则认为是一个promise
                // then.call(res, resolve, reject)
                then.call(res, (y) => {
                    if(called) return
                    called = true
                    // 如果返回的是一个promise，则需要递归解析
                    resolvePromise(promise, y, resolve, reject)
                }, (r) => {
                    if(called) return
                    called = true
                    reject(r)
                })
            }else{
                //then不是函数，则认为是一个普通值
                resolve(res)
            }
        }catch(error){
            if(called) return
            called = true
            reject(error)
        }
    }else{
        //普通值
        resolve(res)
    }
}
Promise.defer = Promise.deferred = function(){
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise