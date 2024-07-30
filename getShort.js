//short data 를 동이름_short 에 시간별로 저장
//primary key 를 시간, 나머지 데이터를 시간에 종속되서 저장
import { coordinates } from "./coordinates.js";
import getApiData from "./getApiData.js";
import connectDB from "./util/connectDB_mysql.js";
import loggingmain from "./util/loggingmain.js";
import convertToDateTime from "./util/convertToDateTime.js";

const categoryKey = {T1H:'tempc',RN1:'rainmm',SKY:'sky',UUU:'windh',VVV:'windv',REH:'humidity',
    PTY:'raintype',LGT:'thunder',VEC:'winddeg',WSD:'windspeed'}

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

async function main(lo='방학3동'){
    let connection;
    try{
        connection = await connectDB();
        const fetchdata = await getApiData(coordinates[lo],'short')
        if (!fetchdata){return}
        const result = getShortData(fetchdata)
        const datas = result.items;
        for(const data of datas){
            const query = `
            INSERT INTO weather.${lo}_short (forecastTime, sky, tempc, rainmm, humidity, raintype) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                sky = VALUES(sky),
                tempc = VALUES(tempc),
                rainmm = VALUES(rainmm),
                humidity = VALUES(humidity),
                raintype = VALUES(raintype)`;
            const {forecastDate,forecastTime} = data;
            const datetime = convertToDateTime(forecastDate,forecastTime)
            const ifNone = (a) => {return a === ''? null : a}
            const values = [
                datetime,
                ifNone(data.sky),
                ifNone(data.tempc),
                ifNone(data.rainmm),
                ifNone(data.humidity),
                ifNone(data.raintype),
            ]
            const [results] = await connection.query(query, values);
        }
    }catch(err){
        console.log(`Uploading Short Error : ${err}`)
    }finally{
        connection && connection.end()
    }
}
loggingmain('getShort.js',main,'방학3동');
