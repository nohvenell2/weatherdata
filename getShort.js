import { baseTimeShort } from "./baseDateTime.js"

const apiShort = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
const apiKey = 'Wuu1S4zjENzkyNEbIBQ5SFQAxLB53WJbPOIHXWIeHO4nktvrzROU3lsg%2FRzPM5tf%2FybaZdFtbaB7F4IZqVTRDA%3D%3D'
const numOfRows = '1000'
const pageNo = '1'
const dataType = 'JSON'
const nx='61'
const ny='129'

async function testShort(){
    const {base_date,base_time}=baseTimeShort()
    const url = `${apiShort}?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    try{
        const result = await (await fetch(url)).json()
        const resCode = result.response.header.resultCode
        const resMsg = result.response.header.resultMsg
        resCode == '00'? result.response.body.items.item.map((d)=>console.log(d))
                        : console.log(resMsg)
    }catch(err){
        console.log(`API FETCH ERR. ${err}`)
    }
}
//testShort();