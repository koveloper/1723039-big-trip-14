import { Menu } from './view/Menu.js';
import { TripInfo } from './view/TripInfo.js';
import { Filters } from './view/Filters.js';
import { Sort } from './view/Sort.js';
import { TripPointCreator } from './view/TripPointCreator.js';
import { TripPointEditor } from './view/TripPointEditor.js';
import { TripPoint } from './view/TripPoint.js';
import { TripPointsContainer } from './view/TripPointsContainer.js';
import { TRIP_POINT_TYPES } from './structures.js';
import { generateTripPointData } from './mock/trip-point.js';


const testPoints = new Array(20).fill().map(() => generateTripPointData());


const viewItems = {
  menu: new Menu(),
  tripInfo: new TripInfo(),
  filters: new Filters(),
  sort: new Sort(),
  tripEventsList: new TripPointsContainer(),
  tripPointCreator: new TripPointCreator(),
  tripPointEditor: new TripPointEditor(),
  tripPoints: testPoints.map((e) => new TripPoint(e)),
};

Object.values(viewItems).reduce((acc, el) => {return [...acc, ...(Array.isArray(el) ? el : [el])];}, []).forEach((el) => el.render());
