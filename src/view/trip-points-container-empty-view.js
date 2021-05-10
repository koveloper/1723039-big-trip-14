import AbstractViewElement from './abstract-view-element.js';
import {AppConstants} from '../constants.js';


export default class TripPointsContainerEmptyView extends AbstractViewElement {
  constructor() {
    super();
    this._state = AppConstants.loadState.LOADING;
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
      case AppConstants.loadState.ERROR:
        sign = 'Something goes wrong...<br>Try to connect later...';
        break;
      case AppConstants.loadState.LOAD_DONE:
        sign = 'Click New Event to create your first point';
        break;
      default:
        sign = 'Loading...';
    }
    return `<p class="trip-events__msg ${this._state === AppConstants.loadState.ERROR ? 'trip-events__msg__error' : ''}">${sign}</p>`;
  }
}
