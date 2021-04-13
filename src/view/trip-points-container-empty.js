import ViewElement from './abstract-view-element.js';

export default class TripPointsContainerEmpty extends ViewElement {
  constructor() {
    super();
    this.template = '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
}
