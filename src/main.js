import MenuView from './view/menu.js';
import HeaderPresenter from './presenter/header.js';
import FiltersView from './view/filters.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import { getComponent, renderElement } from './utils/ui.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const pointsModel = new PointsModel();
pointsModel.setTripPoints(new Array(20).fill().map(() => generateTripPointData()));

const viewItems = {
  menu: new MenuView(),
  headerPresenter: new HeaderPresenter({
    container: getComponent(ViewValues.selectors.INFO),
    model: pointsModel,
  }),
  filters: new FiltersView(),
  tripPresenter: new TripPresenter({
    container: getComponent(ViewValues.selectors.TRIP),
    model: pointsModel,
  }),
};


const renderApp = () => {
  renderElement(getComponent(ViewValues.selectors.MENU), viewItems.menu);
  viewItems.headerPresenter.init();
  renderElement(getComponent(ViewValues.selectors.FILTERS), viewItems.filters);
  viewItems.tripPresenter.init();
};

renderApp();


