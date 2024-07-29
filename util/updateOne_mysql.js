import connectDB from "../util/connectDB_mysql.js";
const cityNames = ['방학3동','상봉1동']
const colNames = ['current','short','mid']
/**
 * mysql 에 업데이트하는 함수
 * @param {JSON} data 
 * @param {string} col 
 * @param {string} cityName 
 */
export default async function updateOne(data,col,cityName){
    let connection;
    try{
        //동 이름, col 이름 에러
        if (!cityName in cityNames || !col in colNames){throw new Error('Wrong Paramether')}
        //data undefined 에러
        if (!data){throw new Error('No Data')}
        const query = `
        INSERT INTO weather.weather_forecast (cityName, ${col}) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        ${col} = VALUES(${col});`;        
        connection = await connectDB();
        const values = [cityName,JSON.stringify(data)]
        const [results] = await connection.query(query,values)
        console.log('Forecast Data Uploaded')
        return results
    }catch(err){
        console.log(`Update Forecast Error : ${err}`)
    }finally{
        if(connection){connection.end()}
    }
}