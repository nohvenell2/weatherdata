/**
 * 1. 정보를 api 로부터 JSON 형식으로 요청
 * 2. 요청 받은 데이터를 간단한 object 로 변환
 * 3. object 를 db 에 전달
 * !! 초단기에보 정보는 매 시 30분에 발표하고 40분에 api 에 업로드
 * !! 매 시 40분에 실행
 * 
 */
import './env.js'
import getApiData from "./getApiData.js"
import { updateData } from "./util/replaceOne_mysql.js"

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
/**
 * get...Data 에서 가공된 object 를 db 에 저장
 * @returns 
 */
async function main(){
    const data = getShortData(await getApiData(방학동,'short'))
    return await updateData(data,'short')
}
await main();
