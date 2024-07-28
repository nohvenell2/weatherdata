import { baseTimeCurrent } from "./baseDateTime.js"
import './env.js'
import replaceOne from './util/replaceOne.js'
//api info
const apiurl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'
const numOfRows = '1000'
const pageNo = '1'
const dataType = 'JSON'
const 방학동 = {nx:61, ny:129}
const 상봉동 = {nx:62, ny:127}
const categoryKey = {T1H:'tempc',RN1:'rainmm',UUU:'windh',VVV:'windv',REH:'humidity',PTY:'raintype',VEC:'winddeg',WSD:'windspeed'}

/**
 * Current Weather API 에서 자료 가져오기
 * @param {object} param0 { nx:int, ny:int } 좌표값
 * @returns resonse.body
 */
async function getCurrentRaw({nx,ny}){
    const {base_date,base_time}=baseTimeCurrent()
    const apiKey=process.env.APIKEY
    const url = `${apiurl}?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    try{
        const result = await (await fetch(url)).json()
        const resCode = result.response.header.resultCode
        const resMsg = result.response.header.resultMsg
        const res = resCode == '00'? result.response.body.items.item : false
        if (res) return res
        throw new Error(`Response Err : ${resMsg}`)
    }catch(err){
        console.log(`API FETCH ERR. ${err}`)
    }
}
/**
 * reponse 에서 받은 raw 데이터를 보기 쉬운 객체로 가공
 * @param {object} data 
 * @returns object
 */
function getCurrentData(data){
    if (!data){return 'Fetch Data for Current API Failed.'}
    const result = {baseTime:data[0].baseTime,items:{}}
    data.forEach(element => {
        const {category, obsrValue} = element;
        if (category in categoryKey){result.items[categoryKey[category]] = obsrValue;}
    });
    return result
}
async function main(){
    const data = getCurrentData(await getCurrentRaw(방학동))
    await replaceOne(data,'current')
}
main()