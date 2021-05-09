import {AppConstants} from '../constants.js';
import {TimeUtils} from '../utils/time.js';

const sortTypes = Object.values(AppConstants.sortType);
const getOffersCost = (tripPoint) => {
  return tripPoint.offers.reduce((acc, offer) => (acc + offer.price), 0);
};
const sortFunctions = {
  [AppConstants.sortType.DAY]: (a, b) => TimeUtils.compare(a.dateFrom, b.dateFrom),
  [AppConstants.sortType.EVENT]: (a, b) => a.type.localeCompare(b.type),
  [AppConstants.sortType.TIME]: (a, b) => TimeUtils.compare(a.dateFrom, a.dateTo) - TimeUtils.compare(b.dateFrom, b.dateTo),
  [AppConstants.sortType.PRICE]: (a, b) => {
    return b.basePrice - a.basePrice;
  },
  [AppConstants.sortType.OFFERS]: (a, b) => {
    return getOffersCost(b) - getOffersCost(a);
  },
};

const Sort = {
  getSortTypes: () => sortTypes,
  getSortFunctions: () => sortFunctions,
  getSortFunction: (sortType) => sortFunctions[sortType],
};

export default Sort;
