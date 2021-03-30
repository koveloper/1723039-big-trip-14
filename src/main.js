import {Menu} from './view/Menu.js';
import {TripInfo} from './view/TripInfo.js';

function renderElement(container, markupCode = '', placeToInsert = 'beforeEnd') {
  if (container) {
    container.insertAdjacentHTML(placeToInsert, markupCode);
  }
}

const menu = new Menu();
const tripInfo = new TripInfo();

renderElement(document.querySelector('.trip-controls__navigation'), menu.markup);
renderElement(document.querySelector('.trip-main'), tripInfo.markup, 'afterBegin');


