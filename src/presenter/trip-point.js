import TripPointEditorView from '../view/trip-point-editor.js';
import TripPointView from '../view/trip-point.js';
import { viewEvents } from '../view/view-events.js';
import { renderElement, toggleView, removeView } from '../utils/ui.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

let _editModeTripPoint = null;

export default class TripPointPresenter {

  constructor({containerForTripPoints, model} = {}) {
    this._container = containerForTripPoints;
    this._tripPointData = null;
    this._tripPointView = null;
    this._tripPointEditView = null;
    this._openEditFormCallback = this._openEditFormCallback.bind(this);
    this._favoriteClickCallback = this._favoriteClickCallback.bind(this);
    this._closeEditFormCallback = this._closeEditFormCallback.bind(this);
    this._savePointChangesCallback = this._savePointChangesCallback.bind(this);
    this._deletePointCallback = this._deletePointCallback.bind(this);
    this._mode = Mode.DEFAULT;
    this._model = model;
  }

  init(tripPointData) {
    this._tripPointData = tripPointData;
    //cache previous view instances
    const prevPointView = this._tripPointView;
    const prevEditPointView = this._tripPointEditView;
    //create view instances
    this._tripPointView = new TripPointView(tripPointData);
    this._tripPointView.setEventListener(viewEvents.uid.OPEN_POINT_POPUP, this._openEditFormCallback);
    this._tripPointView.setEventListener(viewEvents.uid.FAVORITE_CLICK, this._favoriteClickCallback);
    //
    this._tripPointEditView = new TripPointEditorView(tripPointData);
    this._tripPointEditView.setEventListener(viewEvents.uid.CLOSE_POINT_POPUP, this._closeEditFormCallback);
    this._tripPointEditView.setEventListener(viewEvents.uid.SAVE_POINT, this._savePointChangesCallback);
    this._tripPointEditView.setEventListener(viewEvents.uid.DELETE_POINT, this._deletePointCallback);
    //in case of first call just render and return
    if(!prevPointView || !prevEditPointView) {
      renderElement(this._container, this._tripPointView);
      return;
    }
    //otherwise toggle old view on new instances
    toggleView(this._container, prevPointView, this._tripPointView);
    toggleView(this._container, prevEditPointView, this._tripPointEditView);
    //remove old view instances
    removeView(prevPointView);
    removeView(prevEditPointView);
  }

  setEditModeEnabled(enabled) {
    if(_editModeTripPoint && this !== _editModeTripPoint) {
      _editModeTripPoint.setEditModeEnabled(false);
    }
    const from = enabled ? this._tripPointView : this._tripPointEditView;
    const to = enabled ? this._tripPointEditView : this._tripPointView;
    toggleView(this._container, from, to);
    if(enabled) {
      _editModeTripPoint = this;
    } else {
      _editModeTripPoint = null;
    }
  }

  _closeEditFormCallback() {
    this._tripPointEditView.tripPoint = this._tripPointData;
    this.setEditModeEnabled(false);
  }

  _openEditFormCallback() {
    this.setEditModeEnabled(true);
  }

  _favoriteClickCallback() {
    this._commitUpdate({isFavorite: !this._tripPointData.isFavorite});
  }

  _savePointChangesCallback() {
    this._commitUpdate(this._tripPointEditView.tripPoint);
    this.setEditModeEnabled(false);
  }

  _deletePointCallback() {
    this.destroy();
    this._model.deleteTripPoint(this._tripPointData);
  }

  _commitUpdate(updatedObjectPart) {
    this._model.updateTripPoint(Object.assign({}, this._tripPointData, updatedObjectPart));
  }

  destroy() {
    removeView(this._tripPointView);
    removeView(this._tripPointEditView);
  }

  get tripPointData() {
    return this._tripPointData;
  }
}
