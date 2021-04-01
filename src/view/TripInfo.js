import {ViewElement} from './ViewElement.js';
import {ViewValues} from './ViewValues.js';

export class TripInfo extends ViewElement {
  constructor() {
    super();
    this.containerSelector = ViewValues.selectors.INFO;
    this.placeToInsert = 'afterBegin';
    this.markup = `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

              <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>
          </section>`;
  }
}
