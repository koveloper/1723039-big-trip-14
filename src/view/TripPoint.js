import {ViewElement} from './ViewElement.js';
import {ViewValues} from './ViewValues.js';
import {TimeUtils} from '../utils.js';

const generateDate = (tripPoint) => {
  return `<time class="event__date" datetime="${TimeUtils.convertTo_YYYYMMDD(tripPoint.date_from)}">${TimeUtils.convertTo_MonthDay(tripPoint.date_from)}</time>`;
};

const generateDestinationTitle = (tripPoint) => {
  return `<h3 class="event__title">${tripPoint.destination.name}</h3>`;
};

const generateType = (tripPoint) => {
  return `<div class="event__type"><img class="event__type-icon" width="42" height="42" src="img/icons/${tripPoint.type}.png" alt="Event type icon"></div>`;
};

const generateShedule = (tripPoint) => {
  return `<div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${TimeUtils.convertTo_YYYYMMDD_HHMM(tripPoint.date_from)}">${TimeUtils.convertTo_HHMM(tripPoint.date_from)}</time>
                    —
                    <time class="event__end-time" datetime="${TimeUtils.convertTo_YYYYMMDD_HHMM(tripPoint.date_to)}">${TimeUtils.convertTo_HHMM(tripPoint.date_to)}</time>
                  </p>
                  <p class="event__duration">${TimeUtils.getDiff(tripPoint.date_from, tripPoint.date_to)}</p>
                </div>`;
};

const generateBasePrice = (tripPoint) => {
  return `<p class="event__price">
                  €&nbsp;<span class="event__price-value">${tripPoint.base_price}</span>
                </p>`;
};

const generateOffer = (title, price) => {
  return `<li class="event__offer">
                    <span class="event__offer-title">${title}</span>
                    +€&nbsp;
                    <span class="event__offer-price">${price}</span>
                  </li>`;
};

const generateOffers = (tripPoint) => {
  return `<h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${tripPoint.offers.map((o) => generateOffer(o.title, o.price)).join('')}
                </ul>`;
};

const generateFavoriteButton = (tripPoint) => {
  return `<button class="event__favorite-btn ${tripPoint.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
                  </svg>
                </button>`;
};

export class TripPoint extends ViewElement {
  constructor(tripPoint) {
    super();
    this.containerSelector = ViewValues.selectors.POINT_CONTAINER;
    this.markup = `<li class="trip-events__item">
              <div class="event">
                ${generateDate(tripPoint)}
                ${generateType(tripPoint)}
                ${generateDestinationTitle(tripPoint)}
                ${generateShedule(tripPoint)}                
                ${generateBasePrice(tripPoint)}                
                ${generateOffers(tripPoint)}                
                ${generateFavoriteButton(tripPoint)}
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
  }
}
