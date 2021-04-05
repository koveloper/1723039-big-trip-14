import {ViewElement} from './ViewElement.js';
import {ViewValues} from './ViewValues.js';
import {TRIP_POINT_TYPES, CITY_LIST, AVAILABLE_OFFERS_MAP, getPointTypeTitle} from '../structures.js';
import { TimeUtils } from '../utils.js';


const createEventTypeInput = (typeTitle, tripPoint) => {
  return `<div class="event__type-item">
            <input id="event-type-${typeTitle.toLowerCase()}-${tripPoint.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeTitle.toLowerCase()}">
            <label class="event__type-label  event__type-label--${typeTitle.toLowerCase()}" for="event-type-${typeTitle.toLowerCase()}-${tripPoint.id}">${typeTitle}</label>
          </div>`;
};

const createEventTypeMenuButton = (tripPoint) => {
  return `<div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${tripPoint.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${tripPoint.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${tripPoint.id}" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${TRIP_POINT_TYPES.map((t) => createEventTypeInput(t.title, tripPoint)).join('')}
              </fieldset>
            </div>
          </div>`;
};

const createDestinationDataList = (tripPoint) => {
  return `<datalist id="destination-list-${tripPoint.id}">
            ${CITY_LIST.map((c) => '<option value="' + c + '"></option>')}
          </datalist>`;
};

const createDestination = (tripPoint) => {
  return `<div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${tripPoint.id}">
              ${getPointTypeTitle(tripPoint.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${tripPoint.id}" type="text" name="event-destination" value="${tripPoint.destination.name}" list="destination-list-${tripPoint.id}">
            ${createDestinationDataList(tripPoint)}
          </div>`;
};

const createDateField = (pointId, dateStr) => {
  return `<label class="visually-hidden" for="event-start-time-${pointId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${dateStr}">`;
};

const createDates = (tripPoint) => {
  return `<div class="event__field-group  event__field-group--time">
            ${createDateField(tripPoint.id, TimeUtils.convertTo_DDMMYY_HHMM(tripPoint.date_from))}
            —
            ${createDateField(tripPoint.id, TimeUtils.convertTo_DDMMYY_HHMM(tripPoint.date_to))}            
          </div>`;
};

const createBasePrice = (tripPoint) => {
  return `<div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${tripPoint.id}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-${tripPoint.id}" type="text" name="event-price" value="${tripPoint.base_price}">
          </div>`;
};

const createButtons = (tripPoint) => {
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`;
};

const createHeader = (tripPoint) => {
  return `<header class="event__header">                  
            ${createEventTypeMenuButton(tripPoint)}
            ${createDestination(tripPoint)}
            ${createDates(tripPoint)}
            ${createBasePrice(tripPoint)}
            ${createButtons(tripPoint)}
          </header>`;
};

const createOffer = (offer, tripPoint) => {
  const checked = tripPoint.offers.reduce((acc, el) => {return el.title === offer.title ? true : acc;}, false);
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-${tripPoint.id}" type="checkbox" name="event-offer-${offer.title.toLowerCase()}" ${checked ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-${tripPoint.id}">
              <span class="event__offer-title">${offer.title}</span>
              +€&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;
};

const createOffers = (tripPoint) => {
  AVAILABLE_OFFERS_MAP.get(tripPoint.type);
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${AVAILABLE_OFFERS_MAP.get(tripPoint.type).map((o) => createOffer(o, tripPoint)).join('')}
            </div>
          </section>`;
};

const createDescription = (tripPoint) => {
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${tripPoint.destination.description}</p>
          </section>`;
};

const createDetails = (tripPoint) => {
  return `<section class="event__details">
            ${createOffers(tripPoint)}
            ${createDescription(tripPoint)}
          </section>`;
};

export class TripPointEditor extends ViewElement {
  constructor(tripPoint) {
    super();
    this.containerSelector = ViewValues.selectors.POINT_EDITOR;
    this.markup = `<li class="trip-events__item">
                    <form class="event event--edit" action="#" method="post">
                      ${createHeader(tripPoint)}
                      ${createDetails(tripPoint)}
                    </form>
                  </li>`;
  }
}


