import {createConnection} from 'mysql2/promise'
import '../env.js'
const connectionInfo = {
    host: '43.202.38.30',
    user: process.env.MYSQL_ID,
    password: process.env.MYSQL_PW,
    database: 'weather',
    port:4532
}
async function updateData(data,tableName){
    const dataJSON = JSON.stringify(data);
    let connection;
    try{
        connection = await createConnection(connectionInfo);
        const [result] = await connection.query(
            `UPDATE weather.weather_BangHak3Dong SET ${tableName} = ? Where id = ?`,[dataJSON,1]
        )
        return result
    }catch(err){
        console.log(`Error at updateCurrent - mysql Uploading. ${err}`)
    }finally{
        connection && await connection.end();
    }
}
//updateCurrent({name:'Zero'})
export {updateData}



