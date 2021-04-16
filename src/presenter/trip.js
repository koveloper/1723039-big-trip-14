import SortView from '../view/sort.js';
import TripPointEditorView from '../view/trip-point-editor.js';
import TripPointView from '../view/trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import { RenderPosition, getComponent, renderElement, toggleView } from '../utils/ui.js';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._tripPoints = [];
    this._tripPointsView = [];
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
    renderElement(this._tripPointsContainerView, new TripPointView(tripPointData));
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
