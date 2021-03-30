import {ViewElement} from './view/ViewElement.js';
import {Menu} from './view/Menu.js';
import {TripInfo} from './view/TripInfo.js';
import {Filters} from './view/Filters.js';
import {Sort} from './view/Sort.js';
import {TripPointCreator} from './view/TripPointCreator.js';
import {TripPointEditor} from './view/TripPointEditor.js';
import {TripPoint} from './view/TripPoint.js';

function renderElement(container, markupCode = '', placeToInsert = 'beforeEnd') {
  if (container) {
    container.insertAdjacentHTML(placeToInsert, markupCode);
  }
}

const menu = new Menu();
const tripInfo = new TripInfo();
const filters = new Filters();
const sort = new Sort();
const tripEventsList = new ViewElement('<ul class="trip-events__list"></ul>');
const tripPointCreator = new TripPointCreator();
const tripPointEditor = new TripPointEditor();
const tripPoints = [new TripPoint('Saint-Petersburg'), new TripPoint('Arkhangelsk'), new TripPoint('Murmansk')];
renderElement(document.querySelector('.trip-controls__navigation'), menu.markup);
renderElement(document.querySelector('.trip-main'), tripInfo.markup, 'afterBegin');
renderElement(document.querySelector('.trip-controls__filters'), filters.markup);
renderElement(document.querySelector('.trip-events'), sort.markup);
renderElement(document.querySelector('.trip-events'), tripEventsList.markup);
renderElement(document.querySelector('.trip-events__list'), tripPointCreator.markup);
renderElement(document.querySelector('.trip-events__list'), tripPointEditor.markup);
for(const p of tripPoints) {
  renderElement(document.querySelector('.trip-events__list'), p.markup);
}


