import AbstractViewElement from './abstract-view-element.js';
import { ViewValues } from '../constants.js';


export default class TripPointsContainerEmpty extends AbstractViewElement {
  constructor() {
    super();
    this._isLoading = true;
    this._isError = false;
  }

  setLoadingState(value) {
    this._isLoading = value == ViewValues.loadStates.LOADING;
    this._isError = value == ViewValues.loadStates.ERROR;
  }

  getElement() {
    if(!this._element && document.querySelector('.trip-events__msg')) {
      this._element = document.querySelector('.trip-events__msg');
    }
    return super.getElement();
  }

  getTemplate() {
    const sign =
      this._isError ? 'Something goes wrong...<br>Try to connect later...' : (
        this._isLoading ? 'Loading...' : 'Click New Event to create your first point'
      );
    return `<p class="trip-events__msg ${this._isError ? 'trip-events__msg__error' : ''}">${sign}</p>`;
  }
}
