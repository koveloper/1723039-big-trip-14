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
  convertTo_DDMMYY_HHMM: (isoTimeStampString) => {
    return new Date(Date.parse(isoTimeStampString)).toLocaleString('en', {day: '2-digit', month: '2-digit', year: '2-digit'}) + ' ' + new Date(Date.parse(isoTimeStampString)).toLocaleString('en', {hour12: false, hour: '2-digit', minute: '2-digit'});
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
  getDateDiff: (isoDateStrFrom, isoDateStrTo) => {
    const from = new Date(Date.parse(isoDateStrFrom)).toLocaleString('en', {month: 'short', day: '2-digit'});
    const to = new Date(Date.parse(isoDateStrTo)).toLocaleString('en', {month: 'short', day: '2-digit'});
    if(from === to) {
      return from;
    }
    return [from, to.slice(0, 3) === from.slice(0, 3) ? to.slice(3) : to];
  },
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};
