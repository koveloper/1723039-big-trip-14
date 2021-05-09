export const AppConstants = {
  selector: {
    OFFLINE_INDICATOR: '.page-body__page-main',
    MENU: '.trip-controls__navigation',
    INFO: '.trip-main',
    FILTERS: '.trip-controls__filters',
    TRIP: '.trip-events',
    BODY_CONTAINER: '.page-main > .page-body__container',
  },
  filter: {
    EVERYTHING: 'Everything',
    FUTURE: 'Future',
    PAST: 'Past',
  },
  sortType: {
    DAY: 'day',
    EVENT: 'event',
    TIME: 'time',
    PRICE: 'price',
    OFFERS: 'offers',
  },
  loadState: {
    LOADING: 'LOADING',
    LOAD_DONE: 'LOAD_DONE',
    ERROR: 'ERROR',
  },
  pointType: [
    {
      name: 'Taxi',
      isInMotion: true,
    },
    {
      name: 'Bus',
      isInMotion: true,
    },
    {
      name: 'Train',
      isInMotion: true,
    },
    {
      name: 'Ship',
      isInMotion: true,
    },
    {
      name: 'Transport',
      isInMotion: true,
    },
    {
      name: 'Drive',
      isInMotion: true,
    },
    {
      name: 'Flight',
      isInMotion: true,
    },
    {
      name: 'Check-in',
      isInMotion: false,
    },
    {
      name: 'Sightseeing',
      isInMotion: false,
    },
    {
      name: 'Restaurant',
      isInMotion: false,
    },
  ],
  updateType: {
    PATCH: 'PATCH',
    MINOR: 'MINOR',
    MAJOR: 'MAJOR',
    INIT: 'INIT',
    INIT_ERROR: 'INIT_ERROR',
    ERROR: 'ERROR',
  },
  page: {
    STATS: 'STATS',
    TABLE: 'TABLE',
  },
  limit: {
    MAX_CITY_COUNT_IN_HEADER: 3,
  },
  externalEvent: {
    ONLINE: 'online',
  },
  keyboard: {
    ESC_KEY_CODE: 27,
  },
};
