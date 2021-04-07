import { Menu } from './view/Menu.js';
import { TripInfo } from './view/TripInfo.js';
import { Filters } from './view/Filters.js';
import { Sort } from './view/Sort.js';
import { TripPointEditor } from './view/TripPointEditor.js';
import { TripPoint } from './view/TripPoint.js';
import { TripPointsContainer } from './view/TripPointsContainer.js';
import { generateTripPointData } from './mock/trip-point.js';

const testPoints = new Array(20).fill().map(() => generateTripPointData());

const viewItems = {
  menu: new Menu(),
  tripInfo: new TripInfo(testPoints),
  filters: new Filters(),
  sort: new Sort(),
  tripEventsList: new TripPointsContainer(),
  tripPointCreator: new TripPointEditor(),
  tripPointEditor: new TripPointEditor(testPoints[0]),
  tripPoints: testPoints.splice(1).map((e) => new TripPoint(e)),
};

Object.values(viewItems).flatMap((v) => v).forEach((el) => el.render());
