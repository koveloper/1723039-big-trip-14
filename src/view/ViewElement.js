import { createElement } from '../utils.js';

export default class ViewElement {
  constructor() {
    this._template = '';
    this._element = null;
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
}
