import TripPointEditorView from '../view/trip-point-editor.js';
import TripPointView from '../view/trip-point.js';
import { viewEvents } from '../view/view-events.js';
import { renderElement, toggleView, removeView } from '../utils/ui.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  constructor({containerForTripPoints, editClickCallback, closeClickCallback, updateDataCallback, deletePointCallback} = {}) {
    this._container = containerForTripPoints;
    this._tripPointData = null;
    this._tripPointView = null;
    this._tripPointEditView = null;
    this._openEditFormCallback = this._openEditFormCallback.bind(this);
    this._favoriteClickCallback = this._favoriteClickCallback.bind(this);
    this._closeEditFormCallback = this._closeEditFormCallback.bind(this);
    this._savePointChangesCallback = this._savePointChangesCallback.bind(this);
    this._deletePointCallback = this._deletePointCallback.bind(this);
    this._callbacks = {
      editClickCallback,
      closeClickCallback,
      updateDataCallback,
      deletePointCallback,
    };
    this._mode = Mode.DEFAULT;
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
    const from = enabled ? this._tripPointView : this._tripPointEditView;
    const to = enabled ? this._tripPointEditView : this._tripPointView;
    toggleView(this._container, from, to);
  }

  _closeEditFormCallback() {
    this._tripPointEditView.tripPoint = this._tripPointData;
    if(this._callbacks.closeClickCallback) {
      this._callbacks.closeClickCallback(this);
    }
  }

  _favoriteClickCallback() {
    this._commitUpdate({isFavorite: !this._tripPointData.isFavorite});
  }

  _deletePointCallback() {
    if(this._callbacks.deletePointCallback) {
      this._callbacks.deletePointCallback(this);
    }
  }

  _savePointChangesCallback() {
    this._commitUpdate(this._tripPointEditView.tripPoint);
    if(this._callbacks.closeClickCallback) {
      this._callbacks.closeClickCallback(this);
    }
  }

  _openEditFormCallback() {
    if(this._callbacks.editClickCallback) {
      this._callbacks.editClickCallback(this);
    }
  }

  _commitUpdate(updatedObjectPart) {
    if(this._callbacks.updateDataCallback) {
      this._callbacks.updateDataCallback(this, Object.assign({}, this._tripPointData, updatedObjectPart));
    }
  }

  destroy() {
    removeView(this._tripPointView);
    removeView(this._tripPointEditView);
  }

  get tripPointData() {
    return this._tripPointData;
  }
}
