/**
 * 1. 정보를 api 로부터 JSON 형식으로 요청
 * 2. 요청 받은 데이터를 간단한 object 로 변환
 * 3. object 를 db 에 전달
 * !! 초단기실황 정보는 매 시 30분에 발표하고 40분에 api 에 업로드
 * !! 매 시 40분에 실행
 * 
 */
import getApiData from "./getApiData.js"
import updateOne from "./util/updateOne_mysql.js"
import { coordinates } from "./coordinates.js"

const categoryKey = {T1H:'tempc',RN1:'rainmm',UUU:'windh',VVV:'windv',REH:'humidity',PTY:'raintype',VEC:'winddeg',WSD:'windspeed'}

/**
 * api 의 raw object 를 간단한 형식으로 가공
 * @param {object} data 
 * @returns object
 */
function getCurrentData(data){
    if (!data){return false}
    const result = {baseTime:data[0].baseTime,items:{}}
    data.forEach(element => {
        const {category, obsrValue} = element;
        if (category in categoryKey){result.items[categoryKey[category]] = obsrValue;}
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
    const data = getCurrentData(await getApiData(coordinates[lo],'current'))
    //console.log(data.items)
    return await updateOne(data,'current',lo)
}
await main('방학3동');