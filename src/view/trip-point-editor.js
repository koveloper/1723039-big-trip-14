import AbstractInteractiveElement from './abstract-interactive-element.js';
import { ViewEvents } from './view-events.js';
import { CityRules, TripPointRules } from '../app-data.js';
import { TimeUtils } from '../utils/time.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const parseTripPoint = (tripPoint = {}) => {
  const date_ = new Date().toISOString();
  const {
    id = 'new',
    type = TripPointRules.getPointTypeByIndex(0).type,
    destination = CityRules.getCityByIndex(0),
    offers = [],
    basePrice = 0,
    dateFrom = date_,
    dateTo = date_,
    isFavorite = false,
  } = tripPoint;

  return {
    id,
    type,
    destination,
    offers,
    basePrice,
    dateFrom,
    dateTo,
    isFavorite,
    isEditMode: id !== 'new',
    isDestinationExists: CityRules.getCity(destination.name) ? true: false,
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
                ${TripPointRules.getPointTypes().map((t) => createEventTypeInput(t.title, id)).join('')}
              </fieldset>
            </div>
          </div>`;
};

const createDestinationDataList = (id) => {
  return `<datalist id="destination-list-${id}">
            ${CityRules.getCityList().map((c) => '<option value="' + c.name + '"></option>')}
          </datalist>`;
};

const createDestination = (id, type, dst) => {
  return `<div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${TripPointRules.getPointTypeByTypeName(type).title}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${dst}" list="destination-list-${id}">
            ${createDestinationDataList(id)}
          </div>`;
};

const createDateField = (pointId, dateStr, endTimeStamp) => {
  return `<label class="visually-hidden" for="event-${endTimeStamp ? 'end' : 'start'}-time-${pointId}">${endTimeStamp ? 'To' : 'From'}</label>
          <input class="event__input  event__input--time" id="event-${endTimeStamp ? 'end' : 'start'}-time-${pointId}" type="text" name="event-${endTimeStamp ? 'end' : 'start'}-time" value="${dateStr}" readonly>`;
};

const createDates = (id, from, to) => {
  return `<div class="event__field-group  event__field-group--time">
            ${createDateField(id, from)}
            &mdash;
            ${createDateField(id, to, true)}            
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

const createButtons = (isEditMode, isDestinationExists) => {
  return `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDestinationExists ? '' : 'disabled'}>Save</button>
          <button class="event__reset-btn" type="reset">${isEditMode ? 'Delete' : 'Cancel'}</button>`
    + (isEditMode ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : '');
};

const createHeader = (tripPoint) => {
  tripPoint = parseTripPoint(tripPoint);
  return `<header class="event__header">                  
            ${createEventTypeMenuButton(tripPoint.id, tripPoint.type)}
            ${createDestination(tripPoint.id, tripPoint.type, tripPoint.destination.name, tripPoint.state)}
            ${createDates(tripPoint.id, TimeUtils.convertToDDMMYYHHMM(tripPoint.dateFrom), TimeUtils.convertToDDMMYYHHMM(tripPoint.dateTo))}
            ${createBasePrice(tripPoint.id, tripPoint.basePrice)}
            ${createButtons(tripPoint.isEditMode, tripPoint.isDestinationExists)}
          </header>`;
};

const getOfferIdFromTitle = (title) => {
  return title.toLowerCase().replaceAll(/\s+/gm, '_');
};

const createOffer = (offer, pointId, offers) => {
  const checked = offers.find((el) => { return el.title === offer.title; });
  const offerId = getOfferIdFromTitle(offer.title);
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}-${pointId}" type="checkbox" name="event-offer-${offerId}" ${checked ? 'checked' : ''}>
            <label class="event__offer-label" data-offer-id='${offerId}' for="event-offer-${offerId}-${pointId}">
              <span class="event__offer-title" data-offer-id='${offerId}'>${offer.title}</span>
              +€&nbsp;
              <span class="event__offer-price" data-offer-id='${offerId}'>${offer.price}</span>
            </label>
          </div>`;
};

const createOffers = (pointId, type, offers) => {
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${TripPointRules.getOffersByTypeName(type).map((o) => createOffer(o, pointId, offers)).join('')}
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
    this._calendar = null;
    this._init();
    //
    this._dateChanged = this._dateChanged.bind(this);
    this._calendarClosed = this._calendarClosed.bind(this);
    //
    this._wrapAsInternalListener(this._eventTypeListClick, ViewEvents.uid.EVENT_TYPE_CLICK);
    this._wrapAsInternalListener(this._destinationTextFieldEvent, ViewEvents.uid.DESTINATION_FIELD_INPUT);
    this._wrapAsInternalListener(this._priceTextFieldEvent, ViewEvents.uid.PRICE_FIELD_INPUT);
    this._wrapAsInternalListener(this._offersListClick, ViewEvents.uid.OFFERS_CLICK);
    this._wrapAsInternalListener(this._dateTextFieldClick,
      ViewEvents.uid.START_DATE_CLICK,
      ViewEvents.uid.END_DATE_CLICK,
    );
  }

  _initCalendar() {
    if(this._calendar) {
      this._calendar.destroy();
      this._calendar = null;
    }
  }

  _eventTypeListClick(evt) {
    if(evt.event.target.dataset.eventType) {
      this.updateData({type: evt.event.target.dataset.eventType, offers: []});
    }
  }

  _offersListClick(evt) {
    if(evt.event.target.dataset.offerId) {
      const filter = (off) => getOfferIdFromTitle(off.title) === evt.event.target.dataset.offerId;
      const offerInModel = TripPointRules.getOffersByTypeName(this._data.type).find(filter);
      const offerInData = this._data.offers.find(filter);
      let offers = this._data.offers.slice();
      if(offerInData) {
        offers = offers.filter((off) => off.title !== offerInData.title);
      } else {
        offers.push(offerInModel);
      }
      this.updateData({offers});
    }
  }

  _destinationTextFieldEvent(evt) {
    this._performDefaultCallbackOnTextField({
      event: evt.event,
      dataName: 'destination',
      stateName: 'destination',
      dataCreateFunctionByTextFieldValue: (value) => Object.assign({}, {name: value}, CityRules.getCity(value)),
      compareWith: this._data.destination.name,
    });
  }

  _priceTextFieldEvent(evt) {
    this._performDefaultCallbackOnTextField({
      event: evt.event,
      dataName: 'basePrice',
      stateName: 'price',
      dataCreateFunctionByTextFieldValue: (value) => isNaN(parseInt(value)) ? '' : parseInt(value),
      compareWith: this._data.basePrice,
    });
  }

  _showCalendar({selector, date, minDate, maxDate}) {
    if(!this._calendar) {
      this._calendar = flatpickr(this.getElement().querySelector(selector), {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        onClose: this._calendarClosed,
      });
    } else {
      this._calendar.input = this.getElement().querySelector(selector);
    }
    //clear callback function to prevent event callback after setDate call
    this._calendar.set('onChange', null);
    this._calendar.setDate(date, true);
    this._calendar.set('onChange', this._dateChanged);
    this._calendar.set('minDate', minDate);
    this._calendar.set('maxDate', maxDate);
    this._calendar._dateCache = null;
    this._calendar.open();
  }

  _calendarClosed() {
    if(!this._calendar._dateCache) {
      return;
    }
    const update = {};
    if(this._calendar.config.minDate) { //date-to
      update.dateTo = this._calendar._dateCache;
    }
    if(this._calendar.config.maxDate) { //date-from
      update.dateFrom = this._calendar._dateCache;
    }
    this._calendar._dateCache = null;
    this.updateData(update);
  }

  _dateChanged([userDate]) {
    this._calendar._dateCache = userDate.toISOString();
  }

  _dateTextFieldClick(evt) {
    const selector = `#event-${evt.eventUID === ViewEvents.uid.START_DATE_CLICK ? 'start': 'end'}-time-${this._data.id}`;
    const date = Date.parse(evt.eventUID === ViewEvents.uid.START_DATE_CLICK ? this._data.date_from : this._data.date_to);
    const minDate = evt.eventUID === ViewEvents.uid.START_DATE_CLICK ? null : Date.parse(this._data.date_from);
    const maxDate = evt.eventUID === ViewEvents.uid.END_DATE_CLICK ? null : Date.parse(this._data.date_to);
    this._showCalendar({selector, date, minDate, maxDate});
  }

  _init() {
    const createRegEventObject = (selectorInsideParent, handlerUID, eventType = ViewEvents.type.CLICK, args) => {
      return Object.assign({
        selectorInsideParent,
        handlerUID,
        eventType,
      }, args);
    };
    const events = [
      createRegEventObject('.event__save-btn', ViewEvents.uid.SAVE_POINT),
      createRegEventObject('.event__reset-btn', ViewEvents.uid.DELETE_POINT),
      createRegEventObject('.event__type-list', ViewEvents.uid.EVENT_TYPE_CLICK),
      createRegEventObject('.event__input--destination', ViewEvents.uid.DESTINATION_FIELD_INPUT, ViewEvents.type.KEYBOARD_BUTTON_UP),
      createRegEventObject('.event__input--price', ViewEvents.uid.PRICE_FIELD_INPUT, ViewEvents.type.KEYBOARD_BUTTON_UP),
      createRegEventObject('.event__available-offers', ViewEvents.uid.OFFERS_CLICK),
      createRegEventObject(`#event-start-time-${this._data.id}`, ViewEvents.uid.START_DATE_INPUT, ViewEvents.type.KEYBOARD_BUTTON_UP),
      createRegEventObject(`#event-end-time-${this._data.id}`, ViewEvents.uid.END_DATE_INPUT, ViewEvents.type.KEYBOARD_BUTTON_UP),
      createRegEventObject(`#event-start-time-${this._data.id}`, ViewEvents.uid.START_DATE_CLICK),
      createRegEventObject(`#event-end-time-${this._data.id}`, ViewEvents.uid.END_DATE_CLICK),
    ];
    if(this._data.isEditMode) {
      events.push(createRegEventObject('.event__rollup-btn', ViewEvents.uid.CLOSE_POINT_POPUP));
    }
    events.forEach((evt) => {
      this._registerEventSupport(Object.assign({parent: this.getElement()}, evt));
    });
    this._initCalendar();
  }

  restoreHandlers() {
    this._init();
    this._restoreDefaultTextFields(this._data.state, ['destination', 'price']);
    delete this._data.state;
  }

  get tripPoint() {
    return this._data;
  }

  set tripPoint(value = {}) {
    // this._data = ;
    this.updateData(parseTripPoint(value));
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


