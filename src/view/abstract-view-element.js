import { createElement } from '../utils.js';

export default class ViewElement {
  constructor() {
    this._template = '';
    this._element = null;
    this._eventListeners = new Set();
  }

  set template(value) {
    this._template = value;
  }

  get template() {
    return this._template;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  addEventListener(l) {
    if(typeof l == 'function') {
      this._eventListeners.add(l);
    }
  }

  removeEventListener(l) {
    this._eventListeners.remove(l);
  }

  commitEvent(type, data) {
    this._eventListeners.forEach((l) => {
      l({type, source: this, data});
    });
  }
}
