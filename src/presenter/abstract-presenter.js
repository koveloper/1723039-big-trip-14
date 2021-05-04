import {renderElement, removeView} from '../utils/ui.js';

export default class AbstractPresenter {

  constructor(container) {
    this._container = container;
    this._isLoading = true;
  }

  _renderView(view, ...args) {
    renderElement(this._container, view, ...args);
  }

  setLoading(value) {
    this._isLoading = value;
    this.init();
  }

  isLoading() {
    return this._isLoading;
  }

  init() {
    throw new Error('method is not defined in child');
  }
}
