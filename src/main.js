import MenuView from './view/top-menu.js';
import StatisticsPresenter from './presenter/stats.js';
import HeaderPresenter from './presenter/header.js';
import FiltersPresenter from './presenter/filters.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FiltersModel from './model/filters.js';
import TripPointType from './app-structures/trip-point-type.js';
import Cities from './app-structures/cities.js';
import Api from './api/api.js';
import Provider from './api/provider.js';
import Store from './api/store.js';
import {getComponent, renderElement} from './utils/ui.js';
import {ViewValues} from './constants.js';

const AUTHORIZATION = 'Basic KMh6KWDNNVywmlOMihTM';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const APP_ID = 'koveloper.big-trip';
const APP_VERSION = '1';
const store = new Store({key: `${APP_ID}-${APP_VERSION}`, storage: localStorage});
const provider = new Provider({api, storage: store});

const models = {
  points: new PointsModel(),
  filters: new FiltersModel(),
};

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
    provider,
    tripPointsModel: models.points,
    filtersModel: models.filters,
    switchToTableModeCallback: () => {
      menuCallback(ViewValues.uiViewType.TABLE);
    },
  }),
};

const renderApp = () => {
  viewItems.headerPresenter.init();
  viewItems.filtersPresenter.init();
  viewItems.statisticsPresenter.init();
  viewItems.tripPresenter.init();
  menuCallback(ViewValues.uiViewType.TABLE);
};

const initApp = () => {
  renderApp();
  getComponent(ViewValues.selectors.INFO).querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
    viewItems.tripPresenter.setAddNewPointMode();
  });
};

initApp();

provider.getDestinations()
  .then((cityList) => {
    cityList.forEach((city) => Cities.addCity(city));
    return provider.getOffers();
  }).then((offers) => {
    offers.forEach((offer) => TripPointType.setOffers(offer.type, offer.offers));
    return provider.getTripPoints();
  }).then((points) => {
    models.points.setTripPoints(points);
    models.filters.init();
    renderElement(getComponent(ViewValues.selectors.MENU), viewItems.menu);
    viewItems.menu.init();
  }).catch(() => {
    models.points.commitInitError();
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
