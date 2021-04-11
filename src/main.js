import MenuView from './view/Menu.js';
import TripInfoView from './view/TripInfo.js';
import FiltersView from './view/Filters.js';
import SortView from './view/Sort.js';
import TripPointEditorView from './view/TripPointEditor.js';
import TripPointView from './view/TripPoint.js';
import TripPointsContainerView from './view/TripPointsContainer.js';
import RenderUnit from './RenderUnit.js';
import ViewElementWrapper from './view/ViewElementWrapper.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const testPoints = new Array(20).fill().map(() => generateTripPointData());

const viewItemsWrappers = {
  menu:  new ViewElementWrapper(ViewValues.selectors.MENU, new MenuView()),
  tripInfo: new ViewElementWrapper(ViewValues.selectors.INFO, new TripInfoView(testPoints), RenderUnit.getRenderPostions().AFTERBEGIN),
  filters: new ViewElementWrapper(ViewValues.selectors.FILTERS, new FiltersView()),
  sort: new ViewElementWrapper(ViewValues.selectors.SORT, new SortView()),
  tripEventsList: new ViewElementWrapper(ViewValues.selectors.EVENTS, new TripPointsContainerView()),
  tripPoints: new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, testPoints.map((e) => new TripPointView(e))),
};

Object.values(viewItemsWrappers).forEach((we) => we.render());
