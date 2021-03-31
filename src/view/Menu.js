import {ViewElement} from './ViewElement.js';
import {ViewValues} from './ViewValues.js';

export class Menu extends ViewElement {
  constructor() {
    super(ViewValues.selectors.MENU, `<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
                <a class="trip-tabs__btn" href="#">Stats</a>
              </nav>`);
  }
}
