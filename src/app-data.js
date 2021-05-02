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

export const FiltersRules = {
  getFilters: () => filters,

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
  [ViewValues.sortTypes.EVENT]: (a, b) => a.destination.name.localeCompare(b.destination.name),
  [ViewValues.sortTypes.TIME]: (a, b) => TimeUtils.compareTime(a.date_from, b.date_from),
  [ViewValues.sortTypes.PRICE]: (a, b) => { return a.base_price - b.base_price; },
  [ViewValues.sortTypes.OFFERS]: (a, b) => { return getOffersCost(a) - getOffersCost(b); },
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


// class AppData {
//   constructor() {
//     this._pointTypes = pointTypes;
//     this._filters = Object.values(ViewValues.filters);
//     // this.
//     this._sortTypes = Object.values(ViewValues.sortTypes);
//     this._cityListObject = {};
//     this._cityList = [];
//   }

//   get pointTypes() {
//     return this._pointTypes;
//   }

//   get filters() {
//     return this._filters;
//   }

//   getFilterFunction(filter) {

//   }

//   get sortTypes() {
//     return this._sortTypes;
//   }

//   get cityList() {
//     return this._cityList;
//   }
//   getPointTypeByTypeName(type) {
//     return this._pointTypes.find((v) => v.type === type);
//   }

//   getPointTypeByTitle(title) {
//     return this._pointTypes.find((v) => v.title === title);
//   }

//   setOffersByTypeName(type, offers) {
//     const t = this.getPointTypeByTypeName(type);
//     if (t) {
//       t.offers = [...offers];
//     }
//   }

//   setOffersByTypeTitle(title, offers) {
//     const t = this.getPointTypeByTitle(title);
//     if (t) {
//       t.offers = [...offers];
//     }
//   }

//   getOffersByTypeName(type) {
//     const {
//       offers = [],
//     } = this.getPointTypeByTypeName(type);
//     return offers;
//   }

//   getOffersByTitle(title) {
//     const {
//       offers = [],
//     } = this.getPointTypeByTitle(title);
//     return offers;
//   }

//   addCity({ name, description = '', pictures = [] } = {}) {
//     if (name) {
//       this._cityListObject[`${name}`] = {
//         description,
//         pictures,
//       };
//       const c = this._cityList.find((v) => v.name === name);
//       if (c) {
//         this._cityList[this._cityList.indexOf(c)] = { name, description, pictures };
//       } else {
//         this._cityList.push({ name, description, pictures });
//       }
//     }
//   }

//   getCity(name) {
//     return `${name}` in this._cityListObject ? this._cityListObject[`${name}`] : undefined;
//   }

//   getCityPictures(name) {
//     const {
//       pictures = [],
//     } = this.getCity(name);
//     return pictures;
//   }

//   getCityDescription(name) {
//     const {
//       description = [],
//     } = this.getCity(name);
//     return description;
//   }
// }

// export const appData = new AppData();
