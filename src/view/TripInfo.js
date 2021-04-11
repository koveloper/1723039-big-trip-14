import ViewElement from './ViewElement.js';
import { ViewValues } from '../constants.js';
import { TimeUtils } from '../utils.js';

const createDateLimits = (from, to) => {
  let inner = '';
  if (from && to) {
    const dateLimits = TimeUtils.getDateDiff(from, to);
    inner = `${dateLimits[0]}&nbsp;&mdash;&nbsp;${dateLimits[1]}`;
  } else if (from) {
    inner = TimeUtils.convertTo_MonthDay(from);
  }
  return `<p class="trip-info__dates">${inner}</p>`;
};

const createMainInfo = (tripPointsArray = []) => {
  return `<div class="trip-info__main">
            <h1 class="trip-info__title">${tripPointsArray.map((tp) => tp.destination.name).join(' &mdash; ')}</h1>
            ${createDateLimits(tripPointsArray[0].date_from, tripPointsArray[tripPointsArray.length - 1].date_to)}            
          </div>`;
};

const createTotalCost = (value) => {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${value}</span>
          </p>`;
};

export default class TripInfo extends ViewElement {
  constructor(tripPointsArray = []) {
    super();
    this.containerSelector = ViewValues.selectors.INFO;
    this.placeToInsert = 'afterBegin';
    const totalCost = tripPointsArray.reduce((acc, tp) => {
      return acc + tp.base_price + tp.offers.reduce((med, offer) => { return med + offer.price; }, 0);
    }, 0);
    this.template = `<section class="trip-main__trip-info  trip-info">
            ${createMainInfo(tripPointsArray)}
            ${createTotalCost(totalCost)}
          </section>`;
  }
}
