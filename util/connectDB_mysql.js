import '../env.js'
import {createConnection} from 'mysql2/promise'
const connectionInfo = {
    host: 'localhost',
    user: process.env.MYSQL_ID,
    password: process.env.MYSQL_PW,
    database: 'weather',
    port:4532
}
export default async function connectDB(info=connectionInfo){
    try{
        return await createConnection(info);
    }catch(err){
        throw new Error(`Mysql Connection Error - ` + err.message)
    }
}
