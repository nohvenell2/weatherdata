import { connectDB,disconnectDB } from "./connectDB_BangHak.js";
export default async function replaceData(data,colName){
    try{
        const db = await connectDB();
        //과거 데이터 정보 불러오기
        const old = await db.collection(colName).find().toArray();
        const oldid = old[0]?old[0]._id:false;
        //신규 데이터 업로드
        const result = await db.collection(colName).insertOne(data);
        //기존 데이터가 존재하고, 새 데이터가 업로드 완료 됐으면 기존 데이터 삭제
        if (result.acknowledged && oldid){
            await db.collection(colName).deleteOne({_id:oldid})
        }
    }catch(err){
        console.log(`Mongodb Replace Err. ${err}`)
    }finally{
        disconnectDB();
    }
}