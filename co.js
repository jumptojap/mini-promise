let Promise = require("./promise.js")
function co(gen){
    return new Promise((resolve, reject) => {
        const it = gen()
        function next(data){
            try {
                let {value, done} = it.next(data)
                if(done){
                    resolve(value)
                }else{
                    Promise.resolve(value).then(next, handleError)
                }
            } catch (e) {
                reject(e)
            }
        }
        
        function handleError(err) {
            try {
                let {value, done} = it.throw(err)
                if(done){
                    resolve(value)
                }else{
                    Promise.resolve(value).then(next, handleError)
                }
            } catch (e) {
                reject(e)
            }
        }
        
        next()
    })
}
module.exports = co