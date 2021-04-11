import ViewElement from './ViewElement.js';

export default class TripPointsContainerEmpty extends ViewElement {
  constructor() {
    super();
    this.template = '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
}
