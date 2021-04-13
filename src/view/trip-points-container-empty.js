import AbstractViewElement from './abstract-view-element.js';

export default class TripPointsContainerEmpty extends AbstractViewElement {
  constructor() {
    super();
  }

  getTemplate() {
    return '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
}
