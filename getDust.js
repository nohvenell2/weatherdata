/**
 * 1. 정보를 api 로부터 JSON 형식으로 요청
 * 2. 요청 받은 데이터를 간단한 object 로 변환
 * 3. object 를 weather.air_condition_data 에 전달
 * !! 발표 시간 관련 정보는 없음
 * !! 매 시 40분에 실행
 * 
 */

import './env.js'
import connectDB from './util/connectDB_mysql.js'
import loggingmain from './util/loggingmain.js'
//api info
const apiurl = 	'http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureSidoLIst' // 시도 실시간 1시간 평균
const serviceKey = process.env.APIKEY
const returnType = 'json'
const numOfRows = '1000'
const pageNo = '1'
const sidoName = '서울'
const searchCondition = 'HOUR'
const url =`${apiurl}?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&returnType=${returnType}&sidoName=${sidoName}&searchCondition=${searchCondition}`
//api 에서 데이터 가져오기
async function getApiData(url){
    let fetchdata;
    try{
        fetchdata = await fetch(url)
        const result = await fetchdata.json()
        const resCode = result.response.header.resultCode
        const resMsg = result.response.header.resultMsg
        const res = resCode == '00'? result.response.body.items : false
        if (res) {
            //console.log('Fetch air condition data')
            return res
        }
        throw new Error(`API Response Error : ${resMsg}`)
    }catch(err){
        throw new Error(`AirCondition API Fetch Error - ` + err.message)
    }
}
//mysql 에 데이터 저장하기
async function updateAirCondition(data){
    const query = `
    INSERT INTO weather.air_quality_data (cityName, cityNameEng, coValue, dataTime, districtCode, districtNumSeq, khaiValue, no2Value, o3Value, pm10Value, pm25Value, so2Value) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        cityNameEng = VALUES(cityNameEng),
        coValue = VALUES(coValue),
        dataTime = VALUES(dataTime),
        districtCode = VALUES(districtCode),
        districtNumSeq = VALUES(districtNumSeq),
        khaiValue = VALUES(khaiValue),
        no2Value = VALUES(no2Value),
        o3Value = VALUES(o3Value),
        pm10Value = VALUES(pm10Value),
        pm25Value = VALUES(pm25Value),
        so2Value = VALUES(so2Value);`;
    const ifNone = (a) => {return a === ''? null : a}
    const connection = await connectDB();
    try {
        for (const record of data) {
            const values = [
                record.cityName, record.cityNameEng,
                ifNone(record.coValue),
                ifNone(record.dataTime),
                ifNone(record.districtCode),
                ifNone(record.districtNumSeq),
                ifNone(record.khaiValue),
                ifNone(record.no2Value),
                ifNone(record.o3Value),
                ifNone(record.pm10Value),
                ifNone(record.pm25Value),
                ifNone(record.so2Value)
            ];
        const [results] = await connection.query(query, values);
        }
        //console.log('Upload air condition data');
    }catch(err){
        throw new Error('AirCondition Data Uploading Error' + err.message);
    } finally {
        await connection.end();
    }
};
//실행 함수
async function main(){
    try{
        const fetchdata = await getApiData(url)
        const result = await updateAirCondition(fetchdata)
    }catch(err){
        throw new Error(err)
    }
}
//실행
loggingmain('getDust.js',main)

        
