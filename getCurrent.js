//current data 를 동이름_short 에 시간별로 저장
//primary key 를 시간, 나머지 데이터를 시간에 종속되서 저장
import { coordinates } from "./coordinates.js";
import getApiData from "./getApiData.js";
import connectDB from "./util/connectDB_mysql.js";
import loggingmain from "./util/loggingmain.js";

const categoryKey = {T1H:'tempc',RN1:'rainmm',UUU:'windh',VVV:'windv',REH:'humidity',PTY:'raintype',VEC:'winddeg',WSD:'windspeed'}

function getCurrentData(data){
    if (!data){return false}
    const result = {baseTime:data[0].baseTime,items:{}}
    data.forEach(element => {
        const {category, obsrValue} = element;
        if (category in categoryKey){result.items[categoryKey[category]] = obsrValue;}
    });
    return result
}
async function main(lo='방학3동'){
    let connection;
    try{
        connection = await connectDB();
        const fetchdata = await getApiData(coordinates[lo],'current')
        if (!fetchdata){return}
        const result = getCurrentData(fetchdata)
        const data = result.items;
        const query = `
            INSERT INTO weather.${lo}_current (id, tempc, rainmm, humidity, raintype) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                tempc = VALUES(tempc),
                rainmm = VALUES(rainmm),
                humidity = VALUES(humidity),
                raintype = VALUES(raintype)`;
        const ifNone = (a) => {return a === ''? null : a}
        const values = [
            1,
            ifNone(data.tempc),
            ifNone(data.rainmm),
            ifNone(data.humidity),
            ifNone(data.raintype),
        ]
        const [results] = await connection.query(query, values);
    }catch(err){
        console.log(`Uploading Current Error : ${err}`)
    }finally{
        connection && connection.end()
    }
}
loggingmain('getCurrent.js',main,'방학3동');
