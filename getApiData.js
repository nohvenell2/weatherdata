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
    const {base_date,base_time}=baseTimeFunc[type]();
    const url = `${urls[type]}?serviceKey=${process.env.APIKEY}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    try{
        const fetchdata = await fetch(url,{headers:{'Accept':'application/json'}})
        const reqType = fetchdata.headers.get('Content-Type')
        let fetchString = await fetchdata.text()
        let result;
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
        const resCode = result.response.header.resultCode
        const resMsg = result.response.header.resultMsg
        const res = resCode == '00'? result.response.body.items.item : false
        if (res) {
            //console.log(`Fetch ${type} data`)
            return res
        }
        throw new Error(`API Response Error : ${resMsg}\n`)
    }catch(err){
        throw new Error(`[${new Date()}] 기상청 ${type} API Fetch Error\n` + err.message)
    }
}
//console.log(await getApiData({nx:61,ny:129},'mid'))