import AbstractViewElement from './abstract-view-element.js';

export default class TripPointsContainer extends AbstractViewElement {
  constructor() {
    super();
    this.template = '<ul class="trip-events__list"></ul>';
  }
}
