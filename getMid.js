import './env.js'
import { updateData } from "./util/replaceOne_mysql.js"
import getApiData from "./getApiData.js"

const 방학동 = {nx:61, ny:129}
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

async function main(){
    const data = getMidData(await getApiData(방학동,'mid'))
    return await updateData(data,'mid')
}
await main();