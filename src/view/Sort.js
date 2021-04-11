import { ViewElement } from './ViewElement.js';
import { ViewValues } from '../constants.js';
import { appData } from '../app-data.js';

const createSortTemplate = (title = '', checked) => {
  return `<div class="trip-sort__item  trip-sort__item--${title.toLowerCase()}">
            <input id="sort-${title.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${title.toLowerCase()}" ${checked ? 'checked' : ''}>
            <label class="trip-sort__btn" for="sort-${title.toLowerCase()}">${title}</label>
          </div>`;
};

const createSortTemplates = () => {
  return appData.sortTypes.map((title, index) => { return createSortTemplate(title, !index); }).join('');
};

export class Sort extends ViewElement {
  constructor() {
    super();
    this.containerSelector = ViewValues.selectors.SORT;
    this.template = `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
                    ${createSortTemplates()}            
                  </form>`;
  }
}
