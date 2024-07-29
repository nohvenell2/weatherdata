/**
 * 1. 정보를 api 로부터 JSON 형식으로 요청
 * 2. 요청 받은 데이터를 간단한 object 로 변환
 * 3. object 를 db 에 전달
 * !! 단기예보 정보는 2 5 8 11 14 17 20 23 시에 발표하고 발표 10분 후 api 에 업로드
 * !! 매 시 10분에 실행
 */

import getApiData from "./getApiData.js"
import updateOne from './util/updateOne_mysql.js'
import { coordinates } from "./coordinates.js"
import loggingmain from "./util/loggingmain.js"

const categoryKey = {POP:'rainper',SNO:'snowmm',TMP:'tempc',PCP:'rainmm',SKY:'sky',UUU:'windh',VVV:'windv',REH:'humidity',
    PTY:'raintype',VEC:'winddeg',WSD:'windspeed',TMN:'tempmin',TMX:'tempmax',WAV:'wave'}

/**
 * api 의 raw object 를 간단한 형식으로 가공
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
/**
 * get...Data 에서 가공된 object 를 db 에 저장
 * @returns 
 */
async function main(lo='방학3동'){
    if(!lo in coordinates){
        console.log('Wrong City Name')
        return
    }
    const data = getMidData(await getApiData(coordinates[lo],'mid'))
    //console.log(data.items)
    const result = await updateOne(data,'mid',lo)
    return `${(new Date).toLocaleString()} - [getMid.js] Done.`
}
loggingmain('getMid.js',main,'방학3동');
