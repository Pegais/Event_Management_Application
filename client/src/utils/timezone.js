import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const utcToLocal = (utcDate, tz) => {
  return dayjs.utc(utcDate).tz(tz).format("YYYY-MM-DD HH:mm");
};
