import { Temporal } from "@js-temporal/polyfill";
/**
 * Temporal.plainDateTimeISO 객체의 int 시간값을 string 으로 반환
 * @param {Temporal.plainDateTimeISO} now 
 * @returns 
 */
function temporalTimeInfo(now = Temporal.Now.plainDateTimeISO()){
    /**
     * Temporal 에서 정수로 반환하는 값을 00, 01, ... 등등의 스트링으로 변환하는 함수 
     * @param {int} t month, day, hour, minute 등의 두자리 숫자
     * @returns
     */    
    const toStr=(t)=>String(t).padStart(2,'0');
    return { year:String(now.year), month:toStr(now.month), day:toStr(now.day), hour:toStr(now.hour), minute:toStr(now.minute)}
}

/**
 * 초단기실황 - 현재 시간에서 url 쿼리에 사용할 basetime, basedate 을 구함
 * @param {Temporal.plainDateTimeISO} now 
 * @param {int} delay 
 * @returns 
 */
function baseTimeCurrent(now = Temporal.Now.plainDateTimeISO(), delay = 10){
    //10분 딜레이기 때문에 현재 분에서 -10분 으로 시간 조정
    var now = now.subtract({minutes:10})
    var {year,month,day,hour} = temporalTimeInfo(now)
    return {base_time:hour+'00',base_date:year+month+day}
}

/**
 * 초단기예보 - 현재 시간에서 url 쿼리에 사용할 basetime, basedate 을 구함
 * @param {Temporal.plainDateTimeISO} now 
 * @param {int} delay 
 * @returns 
 */
function baseTimeShort(now = Temporal.Now.plainDateTimeISO(), delay = 10){
    //10분 딜레이기 때문에 현재 분에서 -10분 으로 시간 조정
    var now = now.subtract({minutes:10})
    //매 시 30분 이전이면 기준 시간을 1시간 전으로. 
    if (now.minute <= 30){ var now = now.subtract({hours:1}); }
    var {year,month,day,hour} = temporalTimeInfo(now)
    return {base_time:hour+'30',base_date:year+month+day}
}

/**
  * 단기예보 - 현재 시간에서 url 쿼리에 사용할 basetime, basedate 을 구함
 * @param {Temporal.plainDateTimeISO} now 
 * @param {int} delay 
 * @returns 
 */
function baseTimeMid(now = Temporal.Now.plainDateTimeISO(), delay = 10){
    try{
        //10분 딜레이기 때문에 현재 분에서 -10분 으로 시간 조정
        var now = now.subtract({minutes:10})
        //2시 전 => 전날 23시
        if (now.hour == 0 || now.hour == 1){
            now = now.subtract({days:1}).with({hour:23})
        }
        //가장 가까운 기준시간
        else{
            now = now.with({hour: Math.floor((now.hour-2)/3)*3 + 2})
        }
        var {year,month,day,hour} = temporalTimeInfo(now)
        return {base_time:hour+'00',base_date:year+month+day}
    }catch(err){
        throw new Error('baseTimeMid Error - '+err.message)
    }
}
//console.log(baseTimeMid(Temporal.PlainDateTime.from('2024-08-01T02:09:00')))
export {baseTimeCurrent, baseTimeMid, baseTimeShort}