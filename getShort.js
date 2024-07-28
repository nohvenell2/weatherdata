import './env.js'
import getApiData from "./getApiData.js"
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
 * reponse 에서 받은 raw 데이터를 보기 쉬운 객체로 가공
 * @param {object} data 
 * @returns object
 */
function getShortData(data){
    if (!data){return false}
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
    const data = getShortData(await getApiData(방학동,'short'))
    return await updateData(data,'short')
}
await main();
