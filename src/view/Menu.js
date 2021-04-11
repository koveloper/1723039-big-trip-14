import ViewElement from './ViewElement.js';

export default class Menu extends ViewElement {
  constructor() {
    super();
    this.template = `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
                <a class="trip-tabs__btn" href="#">Stats</a>
              </nav>`;
  }
}
