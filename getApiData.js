import { baseTimeCurrent,baseTimeMid,baseTimeShort } from "./baseDateTime.js"
import { XMLParser } from "fast-xml-parser"
import './env.js'
const apiCurrentUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'
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
    //Api 에 요청할 baseTime 계산, url완성
    const {base_date,base_time}=baseTimeFunc[type]();
    const url = `${urls[type]}?serviceKey=${process.env.APIKEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    let fetchdata, reqType, fetchString, result;
    //fetch
    try{
        fetchdata = await fetch(url)
        reqType = fetchdata.headers.get('Content-Type')
        fetchString = await fetchdata.text()
    }catch(err){
        throw new Error(`${type} API Fetch Error\n` + err.message)
    }
    //fetch to JSON. XML 로 응답 오면 분석해서 throw error
    try{
        result = JSON.parse(fetchString)
    }catch(err){
        if (reqType.includes('xml')){
            const parser = new XMLParser();
            const xmlParsed = parser.parse(fetchString);
            throw new Error(`Not JSON, XML Error.\nMessage = ${xmlParsed.OpenAPI_ServiceResponse.cmmMsgHeader.returnAuthMsg}\n`);
        }else{
            throw new Error(`Not JSON Error.\nText =\n${fetchString}\n` + err.message);
        }
    }
    //API 에서 JSON 으로 응답을 함. 응답에 에러 코드가 있을 경우 throw error
    const resCode = result.response.header.resultCode
    const resMsg = result.response.header.resultMsg
    const res = resCode == '00'? result.response.body.items.item : false
    if (!res) {
        throw new Error(`API Response Error : ${resMsg}\n`)
    }
    return res
}
//console.log(await getApiData({nx:61,ny:129},'mid'))