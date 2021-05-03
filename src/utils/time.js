import dayjs from 'dayjs';

export const TimeUtils = {

  convertToMMMDD: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('MMM DD');
  },
  convertToMMDD: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('MM DD');
  },
  convertToYYYYMMDD: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('YYYY-MM-DD');
  },
  convertToYYYYMMDDHHMM: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('YYYY-MM-DDTHH:mm');
  },
  convertToDDMMYYHHMM: (isoTimeStampString) => {
    return dayjs(isoTimeStampString).format('DD/MM/YY HH:mm');
  },
  convertToHHMM: (isoTimeStampString) => {
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
      result += dayDiff.toLocaleString(Object.assign({}, ...formatterArgs, {minimumIntegerDigits: 1})) + 'D ';
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
  getDurationInMilliseconds: (isoDateStrFrom, isoDateStrTo) => {
    return Math.abs(dayjs(isoDateStrTo) - dayjs(isoDateStrFrom));
  },
  compare: (isoDateStrA, isoDateStrB) => {
    return dayjs(isoDateStrA).diff(dayjs(isoDateStrB));
  },
  isInPast: (isoDateStr) => {
    return dayjs().diff(dayjs(isoDateStr)) > 0;
  },
  isInFuture: (isoDateStr) => {
    return dayjs(isoDateStr).diff(dayjs()) >= 0;
  },
  isCurrent: (isoDateStrFrom, isoDateStrTo) => {
    const from = dayjs(isoDateStrFrom);
    const to = dayjs(isoDateStrTo);
    const current = dayjs();
    const max = Math.max(from, to, current);
    const min = Math.min(from, to, current);
    return min == from && max == to;
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
