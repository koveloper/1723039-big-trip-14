import SortView from '../view/sort.js';
import TripPointEditorView from '../view/trip-point-editor.js';
import TripPointView from '../view/trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import { renderElement, toggleView } from '../utils/ui.js';
import { handlerTypes } from '../view/handlers.js';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._tripPoints = [];
    this._tripPointsView = {};
    this._openedTripPoint = null;
    this._closePointEditForm = this._closePointEditForm.bind(this);
    this._openPointEditForm = this._openPointEditForm.bind(this);
  }

  _closePointEditForm() {
    if(this._openedTripPoint) {
      toggleView(this._tripPointsContainerView, this._openedTripPoint, this._tripPointsView[this._openedTripPoint.tripPoint.id]);
      this._openedTripPoint = null;
    }
  }

  _openPointEditForm(evt) {
    this._closePointEditForm();
    this._openedTripPoint = new TripPointEditorView(Object.assign({}, evt.src.tripPoint));
    this._openedTripPoint.addEventListener(handlerTypes.CLOSE_POINT_POPUP, this._closePointEditForm);
    toggleView(this._tripPointsContainerView, evt.src, this._openedTripPoint);
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
    const pointView = new TripPointView(tripPointData);
    this._tripPointsView[tripPointData.id] = pointView;
    pointView.addEventListener(handlerTypes.OPEN_POINT_POPUP, this._openPointEditForm);
    renderElement(this._tripPointsContainerView, pointView);
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
