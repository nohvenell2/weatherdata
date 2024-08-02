//mid data 를 일별로 저장
//db 방학3동 mid table 만들기
//primary key 를 시간, 나머지 데이터를 시간에 종속되서 저장
import { coordinates } from "./constants/coordinates.js";
import getApiData from "./getApiData.js";
import connectDB from "./util/connectDB_mysql.js";
import loggingmain from "./util/loggingmain.js";
import convertToDateTime from "./util/convertToDateTime.js";
import { dongs } from "./constants/locationInfo.js";

const categoryKey = {POP:'rainper',SNO:'snowmm',TMP:'tempc',PCP:'rainmm',SKY:'sky',UUU:'windh',VVV:'windv',REH:'humidity',
    PTY:'raintype',VEC:'winddeg',WSD:'windspeed',TMN:'tempmin',TMX:'tempmax',WAV:'wave'}
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
async function main(dong){
    let connection;
    try{
        connection = await connectDB();
        const fetchdata = await getApiData(coordinates[dong],'mid')
        if (!fetchdata){return}
        const result = getMidData(fetchdata)
        const datas = result.items;
        for(const data of datas){
            const query = `
            INSERT INTO weather.${dong}_mid (forecastTime, sky, tempc, rainmm, snowmm, rainper, humidity, raintype) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                sky = VALUES(sky),
                tempc = VALUES(tempc),
                rainmm = VALUES(rainmm),
                snowmm = VALUES(snowmm),
                rainper = VALUES(rainper),
                humidity = VALUES(humidity),
                raintype = VALUES(raintype)`;
            const {forecastDate,forecastTime} = data;
            const datetime = convertToDateTime(forecastDate,forecastTime)
            const ifNone = (a) => {return a === ''? null : a}
            //todo sky raintype 변환 고려
            const values = [
                datetime,
                ifNone(data.sky),
                ifNone(data.tempc),
                ifNone(data.rainmm),
                ifNone(data.snowmm),
                ifNone(data.rainper),
                ifNone(data.humidity),
                ifNone(data.raintype),
            ]
            const [results] = await connection.query(query, values);
        }
    }catch(err){
        throw new Error(`Uploading ${dong} Mid Error\n` + err.message)
    }finally{
        connection && connection.end()
    }
}
const arg = process.argv.slice(2)[0]
if(!dongs.includes(arg)){throw new Error(`${arg} - 잘못된 argument 입니다`);}
loggingmain('getMid.js',main,arg);

