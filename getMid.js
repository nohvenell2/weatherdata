import { baseTimeMid } from "./baseDateTime.js"
import './env.js'


const apiurl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'
const numOfRows = '1000'
const pageNo = '1'
const dataType = 'JSON'
const 방학동 = {nx:61, ny:129}
const 상봉동 = {nx:62, ny:127}

async function getMidRaw({nx,ny}){
    const {base_date,base_time}=baseTimeMid()
    const apiKey=process.env.APIKEY

    const url = `${apiurl}?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
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
//todo MidForecast 에 tempc sky raintype rainper rainmm humidity showmm 저장
testMid(방학동);