import { connectDB,disconnectDB } from "./connectDB_BangHak.js";
export default async function uploadData(data){
    try{
        const db = await connectDB();
        const result = await db.collection('current').insertOne(data);
        //기존 데이터가 존재하고, 새 데이터가 업로드 완료 됐으면 기존 데이터 삭제
        const old = await db.collection('current').find().toArray();
        const oldid = old?old[0]._id:false;
        if (result.acknowledged && old){
            await db.collection('current').deleteOne({_id:oldid})
        }
    }catch(err){
        console.log(`Mongodb Replace Err. ${err}`)
    }finally{
        disconnectDB();
    }
}