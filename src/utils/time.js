import dayjs from 'dayjs';

export const TimeUtils = {

  convertTo_MMMDD: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('MMM DD');
  },
  convertTo_MMDD: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('MM DD');
  },
  convertTo_YYYYMMDD: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('YYYY-MM-DD');
  },
  convertTo_YYYYMMDD_HHMM: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('YYYY-MM-DDTHH:mm');
  },
  convertTo_DDMMYY_HHMM: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('DD/MM/YY HH:mm');
  },
  convertTo_HHMM: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('HH:mm');
  },
  getDiff: (isoDateStrFrom, isoDateStrTo) => {
    const from = dayjs(isoDateStrFrom);
    const to = dayjs(isoDateStrTo);
    const dayDiff = Math.abs(to.diff(from, 'd'));
    const hourDiff = Math.abs(to.diff(from, 'h')) % 24;
    const minDiff = Math.abs(to.diff(from, 'm')) % 60;
    const formatterArgs = ['en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }];
    let result = '';
    if(dayDiff) {
      result += dayDiff.toLocaleString(...formatterArgs) + 'D ';
    }
    if(result.length || hourDiff) {
      result += hourDiff.toLocaleString(...formatterArgs) + 'H ';
    }
    if(result.length || minDiff) {
      result += minDiff.toLocaleString(...formatterArgs) + 'M ';
    }
    return result;
  },
  getDuration: (isoDateStrFrom, isoDateStrTo) => {
    return [dayjs(isoDateStrFrom).format('MMM DD'), dayjs(isoDateStrTo).format('MMM DD')];
  },
  compare: (isoDateStrA, isoDateStrB) => {
    return dayjs(isoDateStrA).diff(dayjs(isoDateStrB));
  },
  isInFuture: (isoDateStr) => {
    return dayjs().diff(dayjs(isoDateStr));
  },
  isInPast: (isoDateStr) => {
    return dayjs(isoDateStr).diff(dayjs());
  },
  compareTime: (isoDateStrA, isoDateStrB) => {
    const a = dayjs(isoDateStrA);
    const b = dayjs(isoDateStrB);
    if(a.hour() > b.hour()) {
      return 1;
    }
    if(a.hour() < b.hour()) {
      return -1;
    }
    if(a.minute() > b.minute()) {
      return 1;
    }
    if(a.minute() < b.minute()) {
      return -1;
    }
    if(a.second() > b.second()) {
      return 1;
    }
    if(a.second() < b.second()) {
      return -1;
    }
    return 0;
  },
};
