import {ViewElement} from './ViewElement.js';
import {ViewValues} from './ViewValues.js';

export class TripPointsContainer extends ViewElement {
  constructor() {
    super();
    this.containerSelector = ViewValues.selectors.EVENTS;
    this.markup = '<ul class="trip-events__list"></ul>';
  }
}
