import SortView from '../view/sort.js';
import TripPointPresenter from './trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import { renderElement } from '../utils/ui.js';
import { updateItem } from '../utils/common.js';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._tripPoints = [];
    this._tripPointsPresenters = {};
    this._openedTripPoint = null;
    this._editClickCallback = this._editClickCallback.bind(this);
    this._closeClickCallback = this._closeClickCallback.bind(this);
    this._tripPointDataUpdatedCallback = this._tripPointDataUpdatedCallback.bind(this);
    this._sortTypeClickCallback = this._sortTypeClickCallback.bind(this);
    this._sortView.setSortTypeClickCallback(this._sortTypeClickCallback);
  }

  _sortTypeClickCallback(sortType) {
    this._sortView.setSortType(sortType);
  }

  _closeClickCallback(pointIptr) {
    pointIptr.setEditModeEnabled(false);
    this._openedTripPoint = null;
  }

  _editClickCallback(pointIptr) {
    if(this._openedTripPoint) {
      this._openedTripPoint.setEditModeEnabled(false);
    }
    this._openedTripPoint = pointIptr;
    pointIptr.setEditModeEnabled(true);
  }

  _tripPointDataUpdatedCallback(pointPresenterIptr, updatedPointData) {
    this._tripPoints = updateItem(this._tripPoints, updatedPointData);
    pointPresenterIptr.init(updatedPointData);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._renderTrip();
  }

  _renderSort() {
    renderElement(this._tripContainer, this._sortView);
  }

  _renderTripPoints() {
    renderElement(this._tripContainer, this._tripPointsContainerView);
    this._tripPoints.forEach((point) => {this._renderTripPoint(point);});
  }

  _renderTripPoint(tripPointData) {
    const pointPresenter = new TripPointPresenter({
      containerForTripPoints: this._tripPointsContainerView,
      editClickCallback: this._editClickCallback,
      closeClickCallback: this._closeClickCallback,
      updateDataCallback: this._tripPointDataUpdatedCallback,
    });
    this._tripPointsPresenters[tripPointData.id] = pointPresenter;
    pointPresenter.init(tripPointData);
  }

  _renderNoPoints() {
    renderElement(this._tripContainer, this._noPointsView);
  }

  _renderTrip() {
    if(!this._tripPoints || !this._tripPoints.length) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderTripPoints();
  }
}
