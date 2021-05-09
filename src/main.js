import MenuView from './view/menu-view.js';
import OfflineModeView from './view/offline-mode-view.js';
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
import {displayModalMessage, getComponent, removeView, renderElement} from './utils/ui.js';
import {AppConstants} from './constants.js';
import {isOnline} from './utils/common.js';
import Observer from './utils/observer.js';
import Filters from './app-structures/filters.js';
import Sort from './app-structures/sort.js';

const AUTHORIZATION = 'Basic KMh6KWDNNVywmlOMihTMskadhga';
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
  if(!models.points.getTripPoints().length) {
    return;
  }
  viewItems.menu.setUiViewType(uiType);
  viewItems.statisticsPresenter.setVisible(uiType === AppConstants.page.STATS);
  viewItems.tripPresenter.setVisible(uiType === AppConstants.page.TABLE);
};

const checkForOffline = () => {
  if(!isOnline()) {
    renderElement(getComponent(AppConstants.selector.OFFLINE_INDICATOR), viewItems.offlineIndicator);
  } else {
    removeView(viewItems.offlineIndicator);
  }
};

const onlineModeObserver = new Observer();
onlineModeObserver.onlineModeChanged = function (isOnlineMode) {
  this._notify(AppConstants.externalEvent.ONLINE, isOnlineMode);
};


const viewItems = {
  menu: new MenuView(menuCallback),
  offlineIndicator: new OfflineModeView(),
  headerPresenter: new HeaderPresenter({
    container: getComponent(AppConstants.selector.INFO),
    tripPointsModel: models.points,
    sortIface: Sort,
  }),
  filtersPresenter: new FiltersPresenter({
    container: getComponent(AppConstants.selector.FILTERS),
    tripPointsModel: models.points,
    filtersModel: models.filters,
    filtersIface: Filters,
  }),
  statisticsPresenter: new StatisticsPresenter({
    container: getComponent(AppConstants.selector.BODY_CONTAINER),
    model: models.points,
  }),
  tripPresenter: new TripPresenter({
    container: getComponent(AppConstants.selector.TRIP),
    api: provider,
    tripPointsModel: models.points,
    filtersModel: models.filters,
    switchToTableModeCallback: () => {
      menuCallback(AppConstants.page.TABLE);
    },
  }),
};

const renderApp = () => {
  viewItems.headerPresenter.init();
  viewItems.filtersPresenter.init();
  viewItems.statisticsPresenter.init();
  viewItems.tripPresenter.init();
  menuCallback(AppConstants.page.TABLE);
  checkForOffline();
  viewItems.tripPresenter.setExternalEventsObserver(onlineModeObserver);
};

const initApp = () => {
  renderApp();
  getComponent(AppConstants.selector.INFO).querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
    if(isOnline()) {
      viewItems.tripPresenter.setAddNewPointMode();
      return;
    }
    displayModalMessage('Offline mode is not support point adding!');
  });
};

initApp();

provider.getDestinations()
  .then((cityList) => {
    if(!cityList || !cityList.length) {
      throw new Error();
    }
    cityList.forEach((city) => Cities.addCity(city));
    return provider.getOffers();
  }).then((offers) => {
    offers.forEach((offer) => TripPointType.setOffers(offer.type, offer.offers));
    return provider.getTripPoints();
  }).then((points) => {
    models.points.setTripPoints(points);
    models.filters.init();
    renderElement(getComponent(AppConstants.selector.MENU), viewItems.menu);
    viewItems.menu.init();
    getComponent(AppConstants.selector.INFO).querySelector('.trip-main__event-add-btn').disabled = false;
  }).catch(() => {
    models.points.commitInitError();
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  checkForOffline();
  provider.sync();
  onlineModeObserver.onlineModeChanged(true);
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  checkForOffline();
  onlineModeObserver.onlineModeChanged(false);
});
