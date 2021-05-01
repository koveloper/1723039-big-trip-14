import { ViewValues } from '../constants.js';
import { TimeUtils } from './time.js';

export const sortFunctions = {

};
sortFunctions[ViewValues.sortTypes.day] = (a, b) => TimeUtils.compare(a.date_from, b.date_from);
sortFunctions[ViewValues.sortTypes.event] = (a, b) => a.destination.name.localeCompare(b.destination.name);
sortFunctions[ViewValues.sortTypes.time] = (a, b) => TimeUtils.compareTime(a.date_from, b.date_from);
sortFunctions[ViewValues.sortTypes.price] = (a, b) => {return a.base_price - b.base_price;};
sortFunctions[ViewValues.sortTypes.offers] = (a, b) => {return getOffersCost(a) - getOffersCost(b);};

const getOffersCost = (tripPoint) => {
  return tripPoint.offers.reduce((acc, offer) => (acc + offer.price), 0);
};

export const bindEventListenerContext = function (fn, context, handlerType) {
  return function (...args) {
    return fn.call(context, handlerType, ...args);
  };
};
