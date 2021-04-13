import { createElement } from '../utils/ui.js';

export default class AbstractViewElement {
  constructor() {
    if (new.target === AbstractViewElement) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._element = null;
    this._eventListeners = new Set();
  }

  getTemplate() {
    throw new Error('Method is not supported by child.');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
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
