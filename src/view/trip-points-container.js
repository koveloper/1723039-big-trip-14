import AbstractViewElement from './abstract-view-element.js';

export default class TripPointsContainer extends AbstractViewElement {
  constructor() {
    super();
  }

  getTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }
}
