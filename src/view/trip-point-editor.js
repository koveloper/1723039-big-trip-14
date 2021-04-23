import AbstractInteractiveElement from './abstract-interactive-element.js';
import { viewEvents } from './view-events.js';
import { appData } from '../app-data.js';
import { TimeUtils } from '../utils/time.js';

const parseTripPoint = (tripPoint = {}) => {
  const date_ = new Date().toISOString();
  const {
    id = 'new',
    type = appData.pointTypes[0].type,
    destination = appData.cityList[0],
    offers = [],
    base_price = '',
    date_from = date_,
    date_to = date_,
    isFavorite = false,
  } = tripPoint;

  return {
    id,
    type,
    destination,
    offers,
    base_price,
    date_from,
    date_to,
    isFavorite,
    isEditMode: id !== 'new',
  };
};

const createEventTypeInput = (typeTitle, id) => {
  return `<div class="event__type-item">
            <input id="event-type-${typeTitle.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeTitle.toLowerCase()}">
            <label class="event__type-label  event__type-label--${typeTitle.toLowerCase()}" data-event-type="${typeTitle.toLowerCase()}" for="event-type-${typeTitle.toLowerCase()}-${id}">${typeTitle}</label>
          </div>`;
};

const createEventTypeMenuButton = (id, type) => {
  return `<div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${appData.pointTypes.map((t) => createEventTypeInput(t.title, id)).join('')}
              </fieldset>
            </div>
          </div>`;
};

const createDestinationDataList = (id) => {
  return `<datalist id="destination-list-${id}">
            ${appData.cityList.map((c) => '<option value="' + c.name + '"></option>')}
          </datalist>`;
};

const createDestination = (id, type, dst) => {
  return `<div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${appData.getPointTypeByTypeName(type).title}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${dst}" list="destination-list-${id}">
            ${createDestinationDataList(id)}
          </div>`;
};

const createDateField = (pointId, dateStr) => {
  return `<label class="visually-hidden" for="event-start-time-${pointId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${dateStr}">`;
};

const createDates = (id, from, to) => {
  return `<div class="event__field-group  event__field-group--time">
            ${createDateField(id, from)}
            —
            ${createDateField(id, to)}            
          </div>`;
};

const createBasePrice = (id, value) => {
  return `<div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${value}">
          </div>`;
};

const createButtons = (isEditMode) => {
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isEditMode ? 'Delete' : 'Cancel'}</button>`
    + (isEditMode ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : '');
};

const createHeader = (tripPoint) => {
  tripPoint = parseTripPoint(tripPoint);
  return `<header class="event__header">                  
            ${createEventTypeMenuButton(tripPoint.id, tripPoint.type)}
            ${createDestination(tripPoint.id, tripPoint.type, tripPoint.destination.name, tripPoint.state)}
            ${createDates(tripPoint.id, TimeUtils.convertTo_DDMMYY_HHMM(tripPoint.date_from), TimeUtils.convertTo_DDMMYY_HHMM(tripPoint.date_to))}
            ${createBasePrice(tripPoint.id, tripPoint.base_price)}
            ${createButtons(tripPoint.isEditMode)}
          </header>`;
};

const createOffer = (offer, id, offers) => {
  const checked = offers.find((el) => { return el.title === offer.title; });
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-${id}" type="checkbox" name="event-offer-${offer.title.toLowerCase()}" ${checked ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-${id}">
              <span class="event__offer-title">${offer.title}</span>
              +€&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;
};

const createOffers = (id, type, offers) => {
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${appData.getOffersByTypeName(type).map((o) => createOffer(o, id, offers)).join('')}
            </div>
          </section>`;
};

const createDescription = (description = 'There is no information about destination point') => {
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
          </section>`;
};

const createPicture = (url) => {
  return `<img class="event__photo" src="${url}" alt="Event photo">`;
};

const createPictures = (pictures = []) => {
  return `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${pictures.map((p) => createPicture(p.src)).join('')}
            </div>
          </div>`;
};

const createDetails = (tripPoint) => {
  tripPoint = parseTripPoint(tripPoint);
  return `<section class="event__details">
            ${createOffers(tripPoint.id, tripPoint.type, tripPoint.offers)}
            ${createDescription(tripPoint.destination.description)}
            ${createPictures(tripPoint.destination.pictures)}
          </section>`;
};

export default class TripPointEditor extends AbstractInteractiveElement {
  constructor(tripPoint = {}) {
    super();
    this._data = parseTripPoint(tripPoint);
    this._initHandlers();
    //
    this._eventTypeListClick = this._eventTypeListClick.bind(this);
    this.setEventListener(viewEvents.uid.EVENT_TYPE_CLICK, this._eventTypeListClick);
    //
    this._destinationKeyAction = this._destinationKeyAction.bind(this);
    this.setEventListener(viewEvents.uid.DESTINATION_FIELD_INPUT, this._destinationKeyAction);
    //
    this._priceKeyAction = this._priceKeyAction.bind(this);
    this.setEventListener(viewEvents.uid.PRICE_FIELD_INPUT, this._priceKeyAction);
  }

  _eventTypeListClick(evt) {
    if(evt.event.target.dataset.eventType) {
      this.updateData({type: evt.event.target.dataset.eventType});
    }
  }

  _getFocusObject(target) {
    return {
      isFocusOn: true,
      caret: [target.selectionStart, target.selectionEnd],
    };
  }

  _restoreFocus(target, focusObj) {
    if(!focusObj) {
      return;
    }
    if(focusObj.isFocusOn) {
      target.focus();
    }
    if(focusObj.caret) {
      target.setSelectionRange(focusObj.caret[0], focusObj.caret[1]);
    }
  }

  _destinationKeyAction(evt) {
    if(evt.event.target.value === this._data.destination.name) {
      return;
    }
    this.updateData({
      destination: Object.assign({}, {name: evt.event.target.value}, appData.getCity(evt.event.target.value)),
      state: {
        destination: this._getFocusObject(evt.event.target),
      },
    });
  }

  _priceKeyAction(evt) {
    if(evt.event.target.value === this._data.base_price) {
      return;
    }
    this.updateData({
      base_price: parseInt(evt.event.target.value),
      state: {
        price: this._getFocusObject(evt.event.target),
      },
    });
  }

  _initHandlers() {
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__save-btn',
      handlerUID: viewEvents.uid.SAVE_POINT,
      eventType: viewEvents.type.CLICK,
    });
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__reset-btn',
      handlerUID: viewEvents.uid.DELETE_POINT,
      eventType: viewEvents.type.CLICK,
    });
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__type-list',
      handlerUID: viewEvents.uid.EVENT_TYPE_CLICK,
      eventType: viewEvents.type.CLICK,
    });
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__input--destination',
      handlerUID: viewEvents.uid.DESTINATION_FIELD_INPUT,
      eventType: viewEvents.type.KEYBOARD_BUTTON_UP,
    });
    this._registerEventSupport({
      parent: this.getElement(),
      selectorInsideParent: '.event__input--price',
      handlerUID: viewEvents.uid.PRICE_FIELD_INPUT,
      eventType: viewEvents.type.KEYBOARD_BUTTON_UP,
    });
    if(this._data.isEditMode) {
      this._registerEventSupport({
        parent: this.getElement(),
        selectorInsideParent: '.event__rollup-btn',
        handlerUID: viewEvents.uid.CLOSE_POINT_POPUP,
        eventType: viewEvents.type.CLICK,
      });
    }
  }

  restoreHandlers() {
    this._initHandlers();
    const state = this._data.state;
    if(state) {
      const inputs = ['destination', 'price'];
      inputs.forEach((inp) => this._restoreFocus(this.getElement().querySelector(`.event__input--${inp}`), state[inp]));
      delete this._data.state;
    }
  }

  get tripPoint() {
    return this._data;
  }

  set tripPoint(value) {
    this.updateData(value);
  }

  getTemplate() {
    return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                ${createHeader(this._data)}
                ${createDetails(this._data)}
              </form>
            </li>`;
  }
}


