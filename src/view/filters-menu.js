import AbstractInteractiveElement from './abstract-interactive-element.js';
import {ViewEvents} from './view-events.js';

const createFilter = (title, isActive, checked) => {
  const idMix = title.toLowerCase();
  return `<div class="trip-filters__filter">
            <input id="filter-${idMix}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${idMix}" ${checked ? 'checked' : ''} data-filter-type="${title}" ${isActive ? '' : 'disabled'}>
            <label class="trip-filters__filter-label" for="filter-${idMix}">${title}</label>
          </div>`;
};

const createFilters = (filters, selectedFilter) => {
  return filters.map((f) => createFilter(f.type, f.isActive, selectedFilter === f.type)).join('');
};

export default class FiltersView extends AbstractInteractiveElement {
  constructor({filters = [], filterTypeChangeCallback} = {}) {
    super();
    this._filterTypeChangeCallback = filterTypeChangeCallback;
    this._filters = filters;
    this._selectedFilter = null;
    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  init(filter) {
    if (!filter) {
      return;
    }
    if (this._selectedFilter === null) {
      this._selectedFilter = filter;
      this._registerEventSupport({
        parent: this.getElement().parentElement,
        selectorInsideParent: '.trip-filters',
        handlerUID: ViewEvents.uid.FILTER_TYPE_CHANGE,
        eventType: ViewEvents.type.ONCHANGE,
      });
      this.setEventListener(ViewEvents.uid.FILTER_TYPE_CHANGE, this._filterTypeClickHandler);
    }
    this._selectedFilter = filter;
  }

  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
              ${createFilters(this._filters, this._selectedFilter)}
              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
  }

  _filterTypeClickHandler(evt) {
    if (evt.event.target.dataset.filterType && this._filterTypeChangeCallback) {
      if (this._filterTypeChangeCallback) {
        this._filterTypeChangeCallback(evt.event.target.dataset.filterType);
      }
    }
  }
}
