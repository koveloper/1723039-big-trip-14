import ViewElement from './abstract-view-element.js';

export default class TripPointsContainer extends ViewElement {
  constructor() {
    super();
    this.template = '<ul class="trip-events__list"></ul>';
  }
}