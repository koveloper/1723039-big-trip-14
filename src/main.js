import MenuView from './view/Menu.js';
import TripInfoView from './view/TripInfo.js';
import FiltersView from './view/Filters.js';
import SortView from './view/Sort.js';
import TripPointEditorView from './view/TripPointEditor.js';
import TripPointView from './view/TripPoint.js';
import TripPointsContainerView from './view/TripPointsContainer.js';
import { generateTripPointData } from './mock/trip-point.js';

const testPoints = new Array(20).fill().map(() => generateTripPointData());

const viewItems = {
  menu: new MenuView(),
  tripInfo: new TripInfoView(testPoints),
  filters: new FiltersView(),
  sort: new SortView(),
  tripEventsList: new TripPointsContainerView(),
  tripPointCreator: new TripPointEditorView(),
  tripPointEditor: new TripPointEditorView(testPoints[0]),
  tripPoints: testPoints.splice(1).map((e) => new TripPointView(e)),
};

Object.values(viewItems).flatMap((v) => v).forEach((el) => el.render());
