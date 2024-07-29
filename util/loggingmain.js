export default async function loggingmain(fileName='',main,param=false){
    const now = (new Date).toLocaleString()
    console.log(`${now} - [${fileName}] Start`)
    param? await main(param) : await main()
    console.log(`${now} - [${fileName}] Done.`)    
}