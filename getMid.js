import { baseTimeMid } from "./baseDateTime.js"
import './env.js'
import { updateData } from "./util/replaceOne_mysql.js"

const apiurl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'
const numOfRows = '2000'
const pageNo = '1'
const dataType = 'JSON'
const 방학동 = {nx:61, ny:129}
const 상봉동 = {nx:62, ny:127}
const categoryKey = {POP:'rainper',SNO:'snowmm',TMP:'tempc',PCP:'rainmm',SKY:'sky',UUU:'windh',VVV:'windv',REH:'humidity',
    PTY:'raintype',VEC:'winddeg',WSD:'windspeed',TMN:'tempmin',TMX:'tempmax',WAV:'wave'}

/**
 * Current Weather API 에서 자료 가져오기
 * @param {object} param0 { nx:int, ny:int } 좌표값
 * @returns resonse.body
 */
async function getMidRaw({nx,ny}){
    const {base_date,base_time}=baseTimeMid()
    const apiKey=process.env.APIKEY
    const url = `${apiurl}?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    try{
        const result = await (await fetch(url)).json()
        const resCode = result.response.header.resultCode
        const resMsg = result.response.header.resultMsg
        const res = resCode == '00'? result.response.body.items.item : false
        //res.map((d)=>console.log(d))
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
function getMidData(data){
    if (!data){return false}
    const result = {baseTime:data[0].baseTime, items:[{}]}
    var oldfcstTime;
    data.forEach((element,index) => {
        const {category, fcstValue, fcstDate, fcstTime} = element;
        if (index==0){oldfcstTime = fcstTime}
        else if(!(oldfcstTime == fcstTime)){
            result.items.push({})
            oldfcstTime = fcstTime;
        }
        let item = result.items.at(-1)
        item.forecastDate = fcstDate;
        item.forecastTime = fcstTime;
        if (category in categoryKey){item[categoryKey[category]] = fcstValue;}
    });
    return result
}

async function main(){
    const data = getMidData(await getMidRaw(방학동))
    return await updateData(data,'mid')
}
await main();