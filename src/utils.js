export const TimeUtils = {

  convertTo_MonthDay: (isoTimeStampString) => {
    return new Date(Date.parse(isoTimeStampString)).toLocaleString('en', {month: 'short', day: '2-digit'});
  },
  convertTo_YYYYMMDD: (isoTimeStampString) => {
    return isoTimeStampString.split('T')[0];
  },
  convertTo_YYYYMMDD_HHMM: (isoTimeStampString) => {
    return isoTimeStampString.slice(0, -8);
  },
  convertTo_HHMM: (isoTimeStampString) => {
    return isoTimeStampString.slice(-13, -8);
  },
  getDiff: (isoDateStrFrom, isoDateStrTo) => {
    const diffInSeconds = Math.abs(Date.parse(isoDateStrTo) - Date.parse(isoDateStrFrom)) / 1000;
    if(diffInSeconds > (3600 * 24)) {
      return `${Math.floor(diffInSeconds / (3600 * 24))}D ${Math.floor((diffInSeconds % (3600 * 24)) / 3600)}h`;
    } else if(diffInSeconds > 3600) {
      return `${Math.floor(diffInSeconds / 3600)}h ${Math.floor((diffInSeconds % 3600) / 60)}m`;
    } else {
      return `${Math.floor(diffInSeconds / 60)}m`;
    }
  },
};
