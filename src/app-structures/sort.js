import {ViewValues} from '../constants.js';
import {TimeUtils} from '../utils/time.js';

const sortTypes = Object.values(ViewValues.sortTypes);
const getOffersCost = (tripPoint) => {
  return tripPoint.offers.reduce((acc, offer) => (acc + offer.price), 0);
};
const sortFunctions = {
  [ViewValues.sortTypes.DAY]: (a, b) => TimeUtils.compare(a.dateFrom, b.dateFrom),
  [ViewValues.sortTypes.EVENT]: (a, b) => a.type.localeCompare(b.type),
  [ViewValues.sortTypes.TIME]: (a, b) => TimeUtils.compare(a.dateFrom, a.dateTo) - TimeUtils.compare(b.dateFrom, b.dateTo),
  [ViewValues.sortTypes.PRICE]: (a, b) => {
    return b.basePrice - a.basePrice;
  },
  [ViewValues.sortTypes.OFFERS]: (a, b) => {
    return getOffersCost(b) - getOffersCost(a);
  },
};

const Sort = {
  getSortTypes: () => sortTypes,
  getSortFunctions: () => sortFunctions,
  getSortFunction: (sortType) => sortFunctions[sortType],
};

export default Sort;
