import SortView from '../view/sort.js';
import TripPointPresenter from './trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import { renderElement } from '../utils/ui.js';
import { SortRules } from '../app-data.js';
import { ViewValues } from '../constants.js';

export default class TripPresenter {
  constructor({container, model}) {
    this._tripContainer = container;
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._tripPointsPresenters = {};
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);
    this._currentSortType = ViewValues.sortTypes.DAY;
    this._model = model;
    this._model.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _handleSortTypeClick(sortType) {
    if(this._currentSortType === sortType) {
      return;
    }
    //cache sort type and call render
    this._currentSortType = sortType;
    this._sortView.setSortType(sortType);
    this._renderTrip();
  }

  _handleModelEvent(evt) {
    switch(evt.type) {
      case ViewValues.updateType.PATCH:
        this._updateTripPointPresenterData(evt.data);
        break;

      case ViewValues.updateType.MINOR:
      case ViewValues.updateType.MAJOR:
        this._renderTrip();
        break;

      default:
        break;
    }
  }

  _updateTripPointPresenterData(data) {
    if(data.id in this._tripPointsPresenters) {
      this._tripPointsPresenters[data.id].init(data);
    }
  }

  _getTripPoints() {
    return this._model.getTripPoints().slice().sort(SortRules.getSortFunction(this._currentSortType));
  }

  _clearTripPoints() {
    Object.values(this._tripPointsPresenters).forEach((presenter) => presenter.destroy());
    this._tripPointsPresenters = {};
  }

  _renderTrip() {
    this._clearTripPoints();
    const points = this._getTripPoints();
    if(!points.length) {
      renderElement(this._tripContainer, this._noPointsView);
      return;
    }
    this._renderSort();
    this._renderTripPoints(points);
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortView);
    this._sortView.setSortTypeClickCallback(this._handleSortTypeClick);
  }

  _renderTripPoints(points) {
    renderElement(this._tripContainer, this._tripPointsContainerView);
    points.forEach((point) => {this._renderTripPoint(point);});
  }

  _renderTripPoint(tripPointData) {
    const pointPresenter = new TripPointPresenter({
      containerForTripPoints: this._tripPointsContainerView,
      model: this._model,
    });
    this._tripPointsPresenters[tripPointData.id] = pointPresenter;
    pointPresenter.init(tripPointData);
  }
}
