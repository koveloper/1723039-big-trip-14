import AbstractInteractiveElement from './abstract-interactive-element.js';
import { viewEvents } from './view-events.js';
import { TimeUtils } from '../utils/time.js';

const createDate = (from, to) => {
  return `<time class="event__date" datetime="${TimeUtils.convertTo_YYYYMMDD(from)}">${TimeUtils.convertTo_MMMDD(to)}</time>`;
};

const createType = (type) => {
  return `<div class="event__type"><img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon"></div>`;
};

const createDestinationTitle = (name) => {
  return `<h3 class="event__title">${name}</h3>`;
};

const createShedule = (from, to) => {
  return `<div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${TimeUtils.convertTo_YYYYMMDD_HHMM(from)}">${TimeUtils.convertTo_HHMM(from)}</time>
              —
              <time class="event__end-time" datetime="${TimeUtils.convertTo_YYYYMMDD_HHMM(to)}">${TimeUtils.convertTo_HHMM(to)}</time>
            </p>
            <p class="event__duration">${TimeUtils.getDiff(from, to)}</p>
          </div>`;
};

const createBasePrice = (value) => {
  return `<p class="event__price">
            €&nbsp;<span class="event__price-value">${value}</span>
          </p>`;
};

const createOffer = (title, price) => {
  return `<li class="event__offer">
            <span class="event__offer-title">${title}</span>
            +€&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>`;
};

const createOffers = (offers) => {
  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offers.map((o) => createOffer(o.title, o.price)).join('')}
          </ul>`;
};

const createFavoriteButton = (isFavorite) => {
  return `<button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </button>`;
};

export default class TripPoint extends AbstractInteractiveElement {
  constructor(tripPoint) {
    super();
    this.tripPoint = tripPoint;
  }

  set tripPoint(value) {
    this._tripPoint = value;
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__rollup-btn',
      handlerUID: viewEvents.uid.OPEN_POINT_POPUP,
      eventType: viewEvents.type.CLICK,
    });
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__favorite-btn',
      handlerUID: viewEvents.uid.FAVORITE_CLICK,
      eventType: viewEvents.type.CLICK,
    });
  }

  get tripPoint() {
    return this._tripPoint;
  }

  getTemplate() {
    return `<li class="trip-events__item">
              <div class="event">
                ${createDate(this.tripPoint.date_from, this.tripPoint.date_to)}
                ${createType(this.tripPoint.type)}
                ${createDestinationTitle(this.tripPoint.destination.name)}
                ${createShedule(this.tripPoint.date_from, this.tripPoint.date_to)}                
                ${createBasePrice(this.tripPoint.base_price)}                
                ${createOffers(this.tripPoint.offers)}                
                ${createFavoriteButton(this.tripPoint.isFavorite)}
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
  }
}
