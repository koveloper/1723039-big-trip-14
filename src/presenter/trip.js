import SortView from '../view/sort.js';
import TripPointPresenter from './trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import { ModelEvent } from '../model/model-events.js';
import { renderElement } from '../utils/ui.js';
import { sortFunctions } from '../utils/common.js';
import { ViewValues } from '../constants.js';

export default class TripPresenter {
  constructor({tripContainer, model}) {
    this._tripContainer = tripContainer;
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._tripPoints = [];
    this._tripPointsPresenters = {};
    this._modelCallback = this._modelCallback.bind(this);
    this._sortTypeClickCallback = this._sortTypeClickCallback.bind(this);
    this._currentSortType = ViewValues.sortTypes.day;
    this._model = model;
    this._model.addObserver(this._handleModelEvent);
  }

  _sortTypeClickCallback(sortType) {
    if(this._currentSortType === sortType) {
      return;
    }
    //make sort and render
    this._tripPoints = this._tripPoints.slice().sort(sortFunctions[sortType]);
    this._clearTripPoints();
    this._renderTripPoints();
    this._currentSortType = sortType;
    this._sortView.setSortType(sortType);
  }

  _handleModelEvent(evt) {
    switch(evt.type) {
      case ModelEvent.UPDATE_TRIP_POINT:
        this._updateTripPointPresenterData(evt.data);
        break;
      case ModelEvent.UPDATE_TRIP:
        this.init(evt.data);
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

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._renderTrip();
  }

  _renderTrip() {
    this._tripContainer.textContent = '';
    this._clearTripPoints();
    if(!this._tripPoints || !this._tripPoints.length) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderTripPoints();
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortView);
    this._sortView.setSortTypeClickCallback(this._sortTypeClickCallback);
  }

  _renderTripPoints() {
    renderElement(this._tripContainer, this._tripPointsContainerView);
    this._tripPoints.forEach((point) => {this._renderTripPoint(point);});
  }

  _renderTripPoint(tripPointData) {
    const pointPresenter = new TripPointPresenter({
      containerForTripPoints: this._tripPointsContainerView,
      model: this._model,
    });
    this._tripPointsPresenters[tripPointData.id] = pointPresenter;
    pointPresenter.init(tripPointData);
  }

  _renderNoPoints() {
    renderElement(this._tripContainer, this._noPointsView);
  }

  _clearTripPoints() {
    Object.values(this._tripPointsPresenters).forEach((presenter) => presenter.destroy());
    this._tripPointsPresenters = {};
  }
}
