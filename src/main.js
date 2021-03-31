import { ViewElement } from './view/ViewElement.js';
import { Menu } from './view/Menu.js';
import { TripInfo } from './view/TripInfo.js';
import { Filters } from './view/Filters.js';
import { Sort } from './view/Sort.js';
import { TripPointCreator } from './view/TripPointCreator.js';
import { TripPointEditor } from './view/TripPointEditor.js';
import { TripPoint } from './view/TripPoint.js';
import { ViewValues } from './view/ViewValues.js';


const viewItems = {
  menu: new Menu(),
  tripInfo: new TripInfo(),
  filters: new Filters(),
  sort: new Sort(),
  tripEventsList: new ViewElement(ViewValues.selectors.EVENTS, '<ul class="trip-events__list"></ul>'),
  tripPointCreator: new TripPointCreator(),
  tripPointEditor: new TripPointEditor(),
  tripPoints: [new TripPoint('Saint-Petersburg'), new TripPoint('Arkhangelsk'), new TripPoint('Murmansk')],
};

Object.values(viewItems).reduce((acc, el) => {return [...acc, ...(Array.isArray(el) ? el : [el])];}, []).forEach((el) => el.render());
