import { updateData } from "./util/replaceOne_mysql.js"
import getApiData from "./getApiData.js"
import './env.js'

const 방학동 = {nx:61, ny:129}
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
async function main(){
    const data = getCurrentData(await getApiData(방학동,'current'))
    return await updateData(data,'current')
}
await main();