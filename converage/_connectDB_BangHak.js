import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGO_URL;
/*
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
*/
let client;
let db;

async function connectDB() {
    if (db) {
        return db;
    }
    try {
        client = await MongoClient.connect(url);
        db = client.db('Weather_BangHak3Dong');  // 데이터베이스 이름
        console.log('Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

async function disconnectDB() {
    if (client) {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

export { connectDB, disconnectDB };