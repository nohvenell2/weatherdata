import { baseTimeCurrent,baseTimeMid,baseTimeShort } from "./baseDateTime.js"
import './env.js'

const apiCurrentUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'
const apiShortUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
const apiMidUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'
const numOfRows = '2000'
const pageNo = '1'
const dataType = 'JSON'
const baseTimeFunc = {current:baseTimeCurrent,short:baseTimeShort,mid:baseTimeMid}
const urls = {current:apiCurrentUrl,short:apiShortUrl,mid:apiMidUrl}
/**
 * 
 * @param {object} param0 
 * @param {string} type current short mid 택1
 * @returns api 가 응답한 raw object
 */
export default async function getApiData({nx,ny},type){
    const {base_date,base_time}=baseTimeFunc[type]();
    const url = `${urls[type]}?serviceKey=${process.env.APIKEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    try{
        const result = await (await fetch(url)).json()
        const resCode = result.response.header.resultCode
        const resMsg = result.response.header.resultMsg
        const res = resCode == '00'? result.response.body.items.item : false
        if (res) {
            console.log(`${type} data fetched.`)
            return res
        }
        throw new Error(`API Response Error : ${resMsg}`)
    }catch(err){
        console.log(`API fetch Error : ${err}`)
    }
}