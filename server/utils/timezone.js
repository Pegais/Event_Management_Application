const dayjs =require('dayjs');
//UTC : coordinated universal time
const utc =require('dayjs/plugin/utc');
//timezone 
const timezone =require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);


//converting localdatetime zone to UTC
exports.localTimeToUTC=(localString,tz)=>{
    return dayjs.tz(localString,tz).utc().toDate();
}

//converting UTC to localtimezone data and time
exports.utcToLocalTime=(utcDate,tz)=>{
    return dayjs.utc(utcDate).tz(tz).format();
}