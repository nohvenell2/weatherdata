import { baseTimeShort } from "./baseDateTime.js"
import './env.js'
import { updateData } from "./util/replaceOne_mysql.js"

const apiurl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
const numOfRows = '1000'
const pageNo = '1'
const dataType = 'JSON'
const 방학동 = {nx:61, ny:129}
const 상봉동 = {nx:62, ny:127}
const categoryKey = {T1H:'tempc',RN1:'rainmm',SKY:'sky',UUU:'windh',VVV:'windv',REH:'humidity',
    PTY:'raintype',LGT:'thunder',VEC:'winddeg',WSD:'windspeed'}

/**
 * Current Weather API 에서 자료 가져오기
 * @param {object} param0 { nx:int, ny:int } 좌표값
 * @returns resonse.body
 */
async function getShortRaw({nx,ny}){
    const {base_date,base_time}=baseTimeShort()
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
function getShortData(data){
    if (!data){return 'Fetch Data for API Short Failed.'}
    const result = {baseTime:data[0].baseTime, items:[{},{},{},{},{},{}]}
    data.forEach((element,index) => {
        const {category, fcstValue, fcstTime, fcstDate} = element;
        const item = result.items[index%6];
        item.forecastDate = fcstDate;
        item.forecastTime = fcstTime;
        if (category in categoryKey){item[categoryKey[category]] = fcstValue;}
    });
    return result
}
async function main(){
    const data = getShortData(await getShortRaw(방학동))
    return await updateData(data,'short')
}
await main();
