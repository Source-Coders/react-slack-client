import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

function dateTimeService() {
    const now = () => dayjs();

    const dt = (dtString, format) => dayjs(dtString, format);

    const str = (dateTime, format) => {
        return dateTime.format(format);
    }

    return Object.freeze({
        now,
        dt,        
        str,
    });
}

export default dateTimeService; 