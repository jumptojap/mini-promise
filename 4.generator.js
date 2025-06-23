// function* gen(){
//     for(let i=0; i<10; i++){
//         yield i
//     }
// }
// const g = gen()
// console.log(g.next())
// console.log(g.next())
// for(const item of g){
//     console.log(item)
// }

// function* read(){
//     let a = yield "hello"
//     console.log(a)
//     let b = yield "world"
//     console.log(b)
// }
// const r = read()
// //碰到yield就停止
// console.log(r.next())
// console.log(r.next("a"))//传入的值会赋值给上次yield的表达式，返回值为一个对象，value为yield的表达式，done为false
// console.log(r.next("b"))//传入的值会赋值给上次yield的表达式，返回值为一个对象，value为yield的表达式，done为false
// console.log(r.next("c"))//传入的值会赋值给上次yield的表达式，返回值为一个对象，value为yield的表达式，done为true
let fs = require("fs")
function read(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}
function* gen(){
    let path = yield read("./a.txt")
    let b = yield read(path)

}
const g = gen()
Promise.resolve(g.next().value).then(res => {
    console.log(res)
    return Promise.resolve(g.next(res).value)
}).then(res => {
    console.log(res)
    return Promise.resolve(g.next(res).value)
}).then(res => {
    console.log(res)
})
function* f() {
    try {
      yield 1;
    } catch (e) {
      console.log('catch 开始', e.message);
      yield 2;
      console.log('catch 结束');
    }
    yield 3;
  }
const gg = f()
console.log(gg.next())
console.log(gg.throw("error"))
console.log(gg.next())
console.log(gg.next())