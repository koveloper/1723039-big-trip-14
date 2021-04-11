import ViewElement from './ViewElement.js';

export default class TripPointsContainer extends ViewElement {
  constructor() {
    super();
    this.template = '<ul class="trip-events__list"></ul>';
  }
}
