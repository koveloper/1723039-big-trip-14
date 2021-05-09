import AbstractPresenter from './abstract-presenter.js';
import StatisticsView from '../view/stats-view.js';
import {removeView} from '../utils/ui.js';
import {TimeUtils} from '../utils/time.js';
import {AppConstants} from '../constants.js';

export default class StatisticsPresenter extends AbstractPresenter {
  constructor({container, model}) {
    super(container);
    this._model = model;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._model.addObserver(this._handleModelEvent);
    this._view = null;
    this._isVisible = false;
    this._chartData = {
      type: {},
      money: {},
      time: {},
    };
    this._isUpdateCharts = true;
  }

  init() {
    if (!this._isVisible || this.isLoading()) {
      return;
    }
    this.destroy();
    this._view = new StatisticsView();
    this._renderView(this._view);
    //
    this._initChartData();
    this._view.createMoneyChart(this._createSortedObject(this._chartData.money));
    this._view.createTypeChart(this._createSortedObject(this._chartData.type));
    this._view.createTimeChart(this._createSortedObject(this._chartData.time));
    this._isUpdateCharts = false;
  }

  destroy() {
    removeView(this._view);
    this._view = null;
  }

  setVisible(isVisible) {
    this._isVisible = isVisible;
    if (isVisible) {
      if (!this._view || this._isUpdateCharts) {
        this.init();
      }
      this._view.getElement().classList.remove('visually-hidden');
      return;
    }
    if (this._view && this._view.getElement()) {
      this._view.getElement().classList.add('visually-hidden');
    }
  }

  _handleModelEvent(evt) {
    if (evt.type === AppConstants.updateType.INIT_ERROR) {
      return;
    }
    if (evt.type === AppConstants.updateType.INIT) {
      this.setLoading(false);
      return;
    }
    this._isUpdateCharts = true;
    this.init();
  }

  _createSortedObject(obj) {
    const sortedArray = Object.entries(obj).sort((o1, o2) => o2[1] - o1[1]).map((el) => {
      return {[el[0]]: el[1]};
    });
    return Object.assign({}, ...sortedArray);
  }

  _initChartData() {
    AppConstants.pointType.forEach((pType) => {
      this._chartData.type[pType.name.toUpperCase()] = this._model.getTripPoints().reduce((cnt, tripPoint) => {
        return cnt + (tripPoint.type.toUpperCase() === pType.name.toUpperCase() ? 1 : 0);
      }, 0);
      this._chartData.money[pType.name.toUpperCase()] = this._model.getTripPoints().reduce((cnt, tripPoint) => {
        return cnt + (tripPoint.type.toUpperCase() === pType.name.toUpperCase() ? tripPoint.basePrice : 0);
      }, 0);
      this._chartData.time[pType.name.toUpperCase()] = this._model.getTripPoints().reduce((cnt, tripPoint) => {
        return cnt + (tripPoint.type.toUpperCase() === pType.name.toUpperCase() ? TimeUtils.getDurationInMilliseconds(tripPoint.dateFrom, tripPoint.dateTo) : 0);
      }, 0);
    });
  }
}
