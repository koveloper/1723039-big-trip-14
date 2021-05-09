import {renderElement} from '../utils/ui.js';

export default class AbstractPresenter {

  constructor(container) {
    this._container = container;
    this._isLoading = true;
    this._externalEventsObserver = null;
    this._externalEventsCallback = null;
  }

  init() {
    throw new Error('method is not defined in child');
  }

  setLoading(value) {
    this._isLoading = value;
    this.init();
  }

  isLoading() {
    return this._isLoading;
  }

  setExternalEventsObserver(source) {
    this._externalEventsObserver = source;
    if (this._externalEventsObserver && this._externalEventsCallback) {
      this._externalEventsObserver.addObserver(this._externalEventsCallback);
    }
  }

  _setExternalEventsCallback(cFunc) {
    this._externalEventsCallback = cFunc;
    if (this._externalEventsObserver && this._externalEventsCallback) {
      this._externalEventsObserver.addObserver(this._externalEventsCallback);
    }
  }

  _renderView(view, ...args) {
    renderElement(this._container, view, ...args);
  }
}
