import AbstractInteractiveElement from './abstract-interactive-element.js';
import {SortRules} from '../app-data.js';
import {ViewEvents} from './view-events.js';

const createSortTemplate = (title = '', checked) => {
  return `<div class="trip-sort__item  trip-sort__item--${title}">
            <input id="sort-${title}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${title}" ${checked ? 'checked' : ''}>
            <label class="trip-sort__btn" data-sort-type="${title}" for="sort-${title}">${title}</label>
          </div>`;
};

const createSortTemplates = (selectedSortType) => {
  return SortRules.getSortTypes().map((title) => {
    return createSortTemplate(title, title === selectedSortType);
  }).join('');
};

export default class Sort extends AbstractInteractiveElement {
  constructor() {
    super();
    this._sortTypeClickHandler = this._sortTypeClickHandler.bind(this);
    this._registerEventSupport({
      parent: this.getElement().parentElement,
      selectorInsideParent: '.trip-events__trip-sort',
      handlerUID: ViewEvents.uid.SORT_TYPE_CLICK,
      eventType: ViewEvents.type.CLICK,
    });
    this._currentSortType = SortRules.getSortTypes()[0];
    this.setEventListener(ViewEvents.uid.SORT_TYPE_CLICK, this._sortTypeClickHandler);
    this._sortTypeClickCallback = null;
    this._sortElements = [...this.getElement().querySelectorAll('.trip-sort__input')];
  }

  setSortTypeClickCallback(sortTypeClickCallback) {
    this._sortTypeClickCallback = sortTypeClickCallback;
  }

  setSortType(type) {
    if (!SortRules.getSortTypes().find((t) => t === type)) {
      return;
    }
    this._currentSortType = type;
    this._sortElements.forEach((el) => {
      el.removeAttribute('checked');
    });
    this._sortElements.find((el) => el.value === ('sort-' + type)).setAttribute('checked', true);
  }

  _sortTypeClickHandler(evt) {
    if (evt.event.target.dataset.sortType && this._sortTypeClickCallback) {
      this._sortTypeClickCallback(evt.event.target.dataset.sortType);
    }
  }

  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
              ${createSortTemplates(this._currentSortType)}            
            </form>`;
  }
}
