import { ViewValues } from './constants.js';
import { TimeUtils } from './utils/time.js';

/**
 * Trip points rules
 */
const pointTypes = ViewValues.pointTypes.map((v) => {
  return {
    title: v.name,
    type: v.name.toLowerCase(),
    offers: [],
    isInMotion: v.isInMotion,
  };
});

export const TripPointRules = {

  getPointTypes: () => pointTypes,

  getPointTypeByIndex: (i) => pointTypes[i],

  getPointTypeByTypeName: (type) => pointTypes.find((v) => v.type === type),

  getPointTypeByTitle: (title) => pointTypes.find((v) => v.title === title),

  setOffersByTypeName: function (type, offers) {
    const t = this.getPointTypeByTypeName(type);
    if (t) {
      t.offers = [...offers];
    }
  },

  setOffersByTypeTitle: function (title, offers) {
    const t = this.getPointTypeByTitle(title);
    if (t) {
      t.offers = [...offers];
    }
  },

  getOffersByTypeName: function (type) {
    const {
      offers = [],
    } = this.getPointTypeByTypeName(type);
    return offers;
  },

  getOffersByTitle: function (title) {
    const {
      offers = [],
    } = this.getPointTypeByTitle(title);
    return offers;
  },
};

/**
 * Filter rules
 */
const filters = Object.values(ViewValues.filters);
const filtersFunctions = {
  [ViewValues.filters.EVERYTHING]: () => true,
  [ViewValues.filters.FUTURE]: (point) => TimeUtils.isInFuture(point.date_from) || TimeUtils.isCurrent(point.date_from, point.date_to),
  [ViewValues.filters.PAST]: (point) => TimeUtils.isInPast(point.date_to) || TimeUtils.isCurrent(point.date_from, point.date_to),
};

export const FiltersRules = {
  getFilters: () => filters,
  getFiltersFunctions: () => filtersFunctions,
  getFilterFunction: (filterType) => filtersFunctions[filterType],
};

/**
 * sort rules
 */
const getOffersCost = (tripPoint) => {
  return tripPoint.offers.reduce((acc, offer) => (acc + offer.price), 0);
};
const sortTypes = Object.values(ViewValues.sortTypes);
const sortFunctions = {
  [ViewValues.sortTypes.DAY]: (a, b) => TimeUtils.compare(a.date_from, b.date_from),
  [ViewValues.sortTypes.EVENT]: (a, b) => a.type.localeCompare(b.type),
  [ViewValues.sortTypes.TIME]: (a, b) => TimeUtils.compare(a.date_from, a.date_to) - TimeUtils.compare(b.date_from, b.date_to),
  [ViewValues.sortTypes.PRICE]: (a, b) => { return b.base_price - a.base_price; },
  [ViewValues.sortTypes.OFFERS]: (a, b) => { return getOffersCost(b) - getOffersCost(a); },
};

export const SortRules = {
  getSortTypes: () => sortTypes,
  getSortFunctions: () => sortFunctions,
  getSortFunction: (sortType) => sortFunctions[sortType],
};

/**
 * city rules
 */

const cityList = [];

export const CityRules = {

  getCityList: () => cityList,

  addCity: ({ name, description = '', pictures = [] } = {}) =>{
    if (name) {
      const c = cityList.find((v) => v.name === name);
      if (c) {
        cityList[cityList.indexOf(c)] = { name, description, pictures };
      } else {
        cityList.push({ name, description, pictures });
      }
    }
  },

  getCity: (name) => cityList.find((city) => city.name === name),

  getCityByIndex: (i) => cityList[i],

  getCityPictures: function (name) {
    const {
      pictures = [],
    } = this.getCity(name);
    return pictures;
  },

  getCityDescription: function(name) {
    const {
      description = [],
    } = this.getCity(name);
    return description;
  },
};
