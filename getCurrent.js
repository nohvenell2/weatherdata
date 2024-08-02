//current data 를 동이름_current 에 시간별로 저장
//primary key 를 시간, 나머지 데이터를 시간에 종속되서 저장
import { coordinates } from "./constants/coordinates.js";
import { dongs } from "./constants/locationInfo.js";
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
async function main(dong='방학3동'){
    const connection = await connectDB();
    try{
        let fetchdata;
        try{
            fetchdata = await getApiData(coordinates[dong],'current')
            if (!fetchdata){
                console.log('No Data from getApiData.js')
                return
            }
        }catch(err){
            throw new Error(err)
        }

        const result = getCurrentData(fetchdata)

        try{
            const data = result.items;
            const query = `
                INSERT INTO weather.${dong}_current (id, tempc, rainmm, humidity, raintype) 
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
            throw new Error(`[${new Date()}] Uploading ${dong} Current Error\n` + err.message)
        }
    }catch(err){
        throw new Error(err)
    }finally{ connection && connection.end() }
}
const arg = process.argv.slice(2)[0]
if(!dongs.includes(arg)){throw new Error(`${arg} - 잘못된 argument 입니다`);}
loggingmain('getCurrent.js',main,arg);
