import connectDB from "./connectDB_mysql.js";
//newTableDong 만 수정
const newTableDong = '상봉1동'
//
const targetTableDong = '방학3동'
const current = `_current`
const short = `_short`
const mid = `_mid`
//const createQuery = (newTable,targetTable)=>`CREATE TABLE ${newTable} LIKE ${targetTable}`
async function main(){
    const connection = await connectDB();
    await connection.query(createQuery(newTableDong+current,targetTableDong+current))
    await connection.query(createQuery(newTableDong+short,targetTableDong+short))
    await connection.query(createQuery(newTableDong+mid,targetTableDong+mid))
    connection.end()
}
main()