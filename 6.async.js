async function f(){
    try{
        let a = await Promise.resolve(1)
        let b = await Promise.resolve(2)
        let c = await Promise.resolve(3)
        throw new Error("error")
    }catch(e){
        console.log(e)
    }
}
f().then(res => {
    console.log("结果", res)
}).catch(err => {
    console.log("错误", err)
})