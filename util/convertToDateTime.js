export default function convertToDateTime(date, time) {
    // 입력 형식: YYYYMMDD 및 HHMM
    const datePattern = /(\d{4})(\d{2})(\d{2})/;
    const timePattern = /(\d{2})(\d{2})/;
    // 날짜 및 시간 파싱
    const [, year, month, day] = date.match(datePattern);
    const [, hour, minute] = time.match(timePattern);
    // JavaScript Date 객체 생성
    const dateTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
    // 출력 형식 정의
    const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
    return formattedDateTime;
}