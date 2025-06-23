const PENDING = "pending"
const RESOLVED = "resolved"
const REJECTED = "rejected"
class Promise{
    state
    result 
    reason
    onResolvedTasks
    onRejectedTasks
    constructor(executor){
        this.state = PENDING
        this.onRejectedTasks = []
        this.onResolvedTasks = []
        // const resolve = res => {
        //     if(this.state === PENDING){
        //         this.state = RESOLVED
        //         this.result = res  
        //         this.onResolvedTasks.forEach(task => task()) 
        //     }
            
        // }
        // const reject = err => {
        //     if(this.state === PENDING){
        //         this.state = REJECTED
        //         this.reason = err
        //         this.onRejectedTasks.forEach(task => task())
        //     }
        // }
        const resolve = res => {
            if(this.state === PENDING){
                resolvePromise(this, res, r => {
                    this.state = RESOLVED
                    this.result = r
                    this.onResolvedTasks.forEach(fn => fn())
                }, e => {
                    this.state = REJECTED
                    this.reason = e
                    this.onRejectedTasks.forEach(fn => fn())
                })
            }
            
        }
        const reject = err => {
            if(this.state === PENDING){
                this.state = REJECTED
                this.reason = err
                this.onRejectedTasks.forEach(fn => fn())
            }
        }
        try{
            executor(resolve, reject)
        }catch(error){
            reject(error)
        }
    }
    then(onResolved, onRejected){
        onResolved = typeof onResolved === "function" ? onResolved : res => res
        onRejected = typeof onRejected === "function" ? onRejected : err => {throw err} 
        const promise = new Promise((resolve, reject) => {
            if(this.state === RESOLVED){
                setTimeout(() => {
                    try {
                        const res = onResolved(this.result)
                        resolvePromise(promise, res, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }else if(this.state === REJECTED){
                setTimeout(() => {
                    try {
                        const res = onRejected(this.reason)
                        resolvePromise(promise, res, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }else{
                this.onResolvedTasks.push(() => {
                    setTimeout(() => {
                        try {
                            const res = onResolved(this.result)
                            resolvePromise(promise, res, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
                this.onRejectedTasks.push(() => {
                    setTimeout(() => {
                    try {
                        const res = onRejected(this.reason)
                            resolvePromise(promise, res, resolve, reject)
                        } catch (error) {
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
            resolvePromise(null, value, resolve, reject)
        })
    }
    static reject(value){
        return new Promise((resolve, reject) => {
            reject(value)
        })
    }
    static race(promises){
        if(!Array.isArray(promises)){
            throw new TypeError("不是数组")
        }
        return new Promise((resolve, reject) => {
            promises.forEach(item => {
                Promise.resolve(item).then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            })
        })
        
    }
    static all(promises){
        if(!Array.isArray(promises)){
            throw new TypeError("不是数组")
        }
        return new Promise((resolve, reject) => {
            promises.forEach(item => {
                // Promise.resolve(item) => {
                    
                // }
            })
        })
    }
}
function resolvePromise(promise, value, resolve, reject){
    if(promise === value)
        reject(new TypeError("循环嵌套"))
    if(typeof value === 'function' || (typeof value === 'object' && value !== null)){
        let called = false
        try {
            const then = value.then
            if(typeof then === "function"){
                then.call(value, res => {
                    if(called)  return
                    called = true
                    resolvePromise(promise, res, resolve, reject)
                }, err => {
                    if(called)  return
                    called = true
                    reject(err)
                })
            }else{
                resolve(value)
            }
        } catch (error) {
            if(called)  return
            called = true
            reject(error)
        }
    }else{
        resolve(value)
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

