import AbstractViewElement from './abstract-view-element.js';

export default class Menu extends AbstractViewElement {
  constructor() {
    super();
    this.template = `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
                <a class="trip-tabs__btn" href="#">Stats</a>
              </nav>`;
  }
}
