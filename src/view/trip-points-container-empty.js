import AbstractViewElement from './abstract-view-element.js';
import {ViewValues} from '../constants.js';


export default class TripPointsContainerEmpty extends AbstractViewElement {
  constructor() {
    super();
    this._state = ViewValues.loadStates.LOADING;
  }

  setLoadingState(value) {
    this._state = value;
  }

  getElement() {
    if (!this._element && document.querySelector('.trip-events__msg')) {
      this._element = document.querySelector('.trip-events__msg');
    }
    return super.getElement();
  }

  getTemplate() {
    let sign;
    switch (this._state) {
      case ViewValues.loadStates.ERROR:
        sign = 'Something goes wrong...<br>Try to connect later...';
        break;
      case ViewValues.loadStates.LOAD_DONE:
        sign = 'Click New Event to create your first point';
        break;
      default:
        sign = 'Loading...';
    }
    return `<p class="trip-events__msg ${this._state === ViewValues.loadStates.ERROR ? 'trip-events__msg__error' : ''}">${sign}</p>`;
  }
}
