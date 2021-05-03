import MenuView from './view/menu.js';
import StatisticsPresenter from './presenter/stats.js';
import HeaderPresenter from './presenter/header.js';
import FiltersPresenter from './presenter/filters.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FiltersModel from './model/filters.js';
import { getComponent, renderElement } from './utils/ui.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const models = {
  points: new PointsModel(),
  filters: new FiltersModel(),
};

models.points.setTripPoints(new Array(20).fill().map(() => generateTripPointData()));

const menuCallback = (uiType) => {
  viewItems.menu.setUiViewType(uiType);
  viewItems.statisticsPresenter.setVisible(uiType === ViewValues.uiViewType.STATS);
  viewItems.tripPresenter.setVisible(uiType === ViewValues.uiViewType.TABLE);
};

const viewItems = {
  menu: new MenuView(menuCallback),
  headerPresenter: new HeaderPresenter({
    container: getComponent(ViewValues.selectors.INFO),
    model: models.points,
  }),
  filtersPresenter: new FiltersPresenter({
    container: getComponent(ViewValues.selectors.FILTERS),
    model: models.filters,
  }),
  statisticsPresenter: new StatisticsPresenter({
    container: getComponent(ViewValues.selectors.BODY_CONTAINER),
    model: models.points,
  }),
  tripPresenter: new TripPresenter({
    container: getComponent(ViewValues.selectors.TRIP),
    tripPointsModel: models.points,
    filtersModel: models.filters,
    switchToTableModeCallback: () => {
      menuCallback(ViewValues.uiViewType.TABLE);
    },
  }),
};

const renderApp = () => {
  renderElement(getComponent(ViewValues.selectors.MENU), viewItems.menu);
  viewItems.menu.init();
  viewItems.headerPresenter.init();
  viewItems.filtersPresenter.init();
  viewItems.statisticsPresenter.init();

  // renderElement(getComponent(ViewValues.selectors.BODY_CONTAINER), viewItems.statistics);
  viewItems.tripPresenter.init();
  menuCallback(ViewValues.uiViewType.TABLE);

};

renderApp();


getComponent(ViewValues.selectors.INFO).querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
  viewItems.tripPresenter.setAddNewPointMode(true);
});
