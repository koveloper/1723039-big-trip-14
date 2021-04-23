import AbstractInteractiveElement from './abstract-interactive-element.js';
import { appData } from '../app-data.js';
import { handlerTypes } from './handlers.js';

const createSortTemplate = (title = '', checked) => {
  return `<div class="trip-sort__item  trip-sort__item--${title}">
            <input id="sort-${title}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${title}" ${checked ? 'checked' : ''}>
            <label class="trip-sort__btn" data-sort-type="${title}" for="sort-${title}">${title}</label>
          </div>`;
};

const createSortTemplates = () => {
  return appData.sortTypes.map((title, index) => { return createSortTemplate(title, !index); }).join('');
};

export default class Sort extends AbstractInteractiveElement {
  constructor() {
    super();
    this._sortTypeClickHandler = this._sortTypeClickHandler.bind(this);
    this._registerEventSupport({
      parent: this.getElement().parentElement,
      selectorInsideParent: '.trip-events__trip-sort',
      handlerUID: handlerTypes.SORT_TYPE_CLICK,
      eventType: 'click',
    });
    this.setEventListener(handlerTypes.SORT_TYPE_CLICK, this._sortTypeClickHandler);
    this._sortTypeClickCallback = null;
    this._sortElements = [...this.getElement().querySelectorAll('.trip-sort__input')];
  }

  setSortTypeClickCallback(sortTypeClickCallback) {
    this._sortTypeClickCallback = sortTypeClickCallback;
  }

  setSortType(type) {
    if(!appData.sortTypes.find((t) => t === type)) {
      return;
    }
    this._sortElements.forEach((el) => {el.removeAttribute('checked');});
    this._sortElements.find((el) => el.value === ('sort-' + type)).setAttribute('checked', true);
  }

  _sortTypeClickHandler(evt) {
    if(evt.event.target.dataset.sortType && this._sortTypeClickCallback) {
      this._sortTypeClickCallback(evt.event.target.dataset.sortType);
    }
  }

  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
              ${createSortTemplates()}            
            </form>`;
  }
}
