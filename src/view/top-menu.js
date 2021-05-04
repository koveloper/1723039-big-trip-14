import AbstractViewElement from './abstract-view-element.js';
import { ViewEvents } from './view-events.js';
import { ViewValues } from '../constants.js';

export default class Menu extends AbstractViewElement {
  constructor(uiTypeClickCallback) {
    super();
    this._uiTypeClickCallback = uiTypeClickCallback;
  }

  init() {
    if(!this.getElement()) {
      return;
    }
    this.getElement().addEventListener(ViewEvents.type.CLICK, (evt) => {
      if(evt.target.dataset.uiType && this._uiTypeClickCallback) {
        this._uiTypeClickCallback(evt.target.dataset.uiType);
      }
    });
    this.setUiViewType(ViewValues.uiViewType.TABLE);
  }

  setUiViewType(type) {
    if(!this.getElement()) {
      return;
    }
    [...this.getElement().querySelectorAll('[data-ui-type]')].forEach((el) => el.classList.remove('trip-tabs__btn--active'));
    this.getElement().querySelector(`[data-ui-type='${type}']`).classList.add('trip-tabs__btn--active');
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn" data-ui-type='${ViewValues.uiViewType.TABLE}' href="#">Table</a>
              <a class="trip-tabs__btn" data-ui-type='${ViewValues.uiViewType.STATS}' href="#">Stats</a>
            </nav>`;
  }
}
