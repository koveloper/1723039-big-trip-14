import {createElement} from '../utils/ui.js';

export default class AbstractViewElement {
  constructor() {
    if (new.target === AbstractViewElement) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._element = null;
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

  isElementExists() {
    return this._element !== null;
  }

  removeElement() {
    this._element = null;
  }
}
