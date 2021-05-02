import AbstractInteractiveElement from './abstract-interactive-element.js';
import { viewEvents } from './view-events.js';

const createFilter = (title, checked) => {
  const idMix = title.toLowerCase();
  return `<div class="trip-filters__filter">
            <input id="filter-${idMix}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${idMix}" ${checked ? 'checked' : ''} data-filter-type="${title}">
            <label class="trip-filters__filter-label" for="filter-${idMix}">${title}</label>
          </div>`;
};

const createFilters = (filerTypes) => {
  return filerTypes.map((f, i) => createFilter(f, !i)).join('');
};

export default class Filters extends AbstractInteractiveElement {
  constructor({filerTypes = [], filterTypeChangeCallback} = {}) {
    super();
    this._filterTypeChangeCallback = filterTypeChangeCallback;
    this._filerTypes = filerTypes;
    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._registerEventSupport({
      parent: this.getElement().parentElement,
      selectorInsideParent: '.trip-filters',
      handlerUID: viewEvents.uid.FILTER_TYPE_CHANGE,
      eventType: viewEvents.type.ONCHANGE,
    });
    this.setEventListener(viewEvents.uid.FILTER_TYPE_CHANGE, this._filterTypeClickHandler);
  }

  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
              ${createFilters(this._filerTypes)}
              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
  }

  _filterTypeClickHandler(evt) {
    if(evt.event.target.dataset.filterType && this._filterTypeChangeCallback) {
      if(this._filterTypeChangeCallback) {
        this._filterTypeChangeCallback(evt.event.target.dataset.filterType);
      }
    }
  }
}
