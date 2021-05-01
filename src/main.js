import MenuView from './view/menu.js';
import TripInfoView from './view/trip-info.js';
import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import { RenderPosition, getComponent, renderElement } from './utils/ui.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const pointsModel = new PointsModel();
pointsModel.setTripPoints(new Array(20).fill().map(() => generateTripPointData()));

const viewItems = {
  menu: new MenuView(),
  tripInfo: new TripInfoView(pointsModel.getTripPoints()),
  filters: new FiltersView(),
  tripPresenter: new TripPresenter({
    tripContainer: getComponent(ViewValues.selectors.TRIP),
    model: pointsModel,
  }),
};


const renderApp = () => {
  renderElement(getComponent(ViewValues.selectors.MENU), viewItems.menu);
  renderElement(getComponent(ViewValues.selectors.INFO), viewItems.tripInfo, RenderPosition.AFTERBEGIN);
  renderElement(getComponent(ViewValues.selectors.FILTERS), viewItems.filters);
  viewItems.tripPresenter.init(pointsModel.getTripPoints());
};

renderApp();


