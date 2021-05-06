import TripPointEditorView from '../view/trip-point-editor.js';
import TripPointView from '../view/trip-point.js';
import {ViewEvents} from '../view/view-events.js';
import {renderElement, toggleView, removeView} from '../utils/ui.js';

export default class TripPointPresenter {

  constructor({containerForTripPoints, openEditFormCallback, closeEditFormCallback, updatePointDataCallback, deletePointCallback} = {}) {
    this._container = containerForTripPoints;
    this._tripPointData = null;
    this._tripPointView = null;
    this._tripPointEditView = null;
    this._callbacks = {
      onOpenEditForm: openEditFormCallback,
      onCloseEditForm: closeEditFormCallback,
      onUpdatePointData: updatePointDataCallback,
      onDeletePoint: deletePointCallback,
    };
    this._handleOpenEditFormButtonClick = this._handleOpenEditFormButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
    this._handleCloseEditFormButtonClick = this._handleCloseEditFormButtonClick.bind(this);
    this._handleSavePointChangesButtonClick = this._handleSavePointChangesButtonClick.bind(this);
    this._handleDeletePointButtonClick = this._handleDeletePointButtonClick.bind(this);
    this._editMode = false;
  }

  init(tripPointData) {
    this._tripPointData = tripPointData;
    // cache previous view instances
    const prevPointView = this._tripPointView;
    const prevEditPointView = this._tripPointEditView;
    // create view instances
    this._tripPointView = new TripPointView(tripPointData);
    this._tripPointView.setEventListener(ViewEvents.uid.OPEN_POINT_POPUP, this._handleOpenEditFormButtonClick);
    this._tripPointView.setEventListener(ViewEvents.uid.FAVORITE_CLICK, this._handleFavoriteButtonClick);
    // create edit form view
    this._tripPointEditView = new TripPointEditorView(tripPointData);
    this._tripPointEditView.setEventListener(ViewEvents.uid.CLOSE_POINT_POPUP, this._handleCloseEditFormButtonClick);
    this._tripPointEditView.setEventListener(ViewEvents.uid.SAVE_POINT, this._handleSavePointChangesButtonClick);
    this._tripPointEditView.setEventListener(ViewEvents.uid.DELETE_POINT, this._handleDeletePointButtonClick);
    // in case of first call just render and return
    if (!prevPointView || !prevEditPointView) {
      renderElement(this._container, this._tripPointView);
      return;
    }
    // otherwise toggle old view on new instances
    toggleView(this._container, prevPointView, this._tripPointView);
    toggleView(this._container, prevEditPointView, this._tripPointEditView);
    // remove old view instances
    removeView(prevPointView);
    removeView(prevEditPointView);
  }

  destroy() {
    this._editMode = false;
    removeView(this._tripPointView);
    removeView(this._tripPointEditView);
  }

  get tripPointData() {
    return this._tripPointData;
  }

  setEditModeEnabled(enabled) {
    const from = enabled ? this._tripPointView : this._tripPointEditView;
    const to = enabled ? this._tripPointEditView : this._tripPointView;
    toggleView(this._container, from, to);
    if (!enabled) {
      this._tripPointEditView.tripPoint = this._tripPointData;
    } else {
      this._tripPointEditView.restoreHandlers();
    }
    this._editMode = enabled;
  }

  setBlock(isBlocked) {
    this._tripPointEditView.setBlock(isBlocked);
  }

  unlockWithError() {
    if (this._editMode) {
      this._tripPointEditView.unlockWithError();
    } else {
      this._tripPointView.unlockWithError();
    }
  }

  _handleCloseEditFormButtonClick() {
    this._invokeCallback(this._callbacks.onCloseEditForm, this);
  }

  _handleOpenEditFormButtonClick() {
    this._invokeCallback(this._callbacks.onOpenEditForm, this);
  }

  _handleFavoriteButtonClick() {
    this._commitUpdate({isFavorite: !this._tripPointData.isFavorite});
  }

  _handleSavePointChangesButtonClick() {
    this._commitUpdate(this._tripPointEditView.tripPoint);
  }

  _commitUpdate(updatedObjectPart) {
    this._invokeCallback(this._callbacks.onUpdatePointData, Object.assign({}, this._tripPointData, updatedObjectPart));
  }

  _handleDeletePointButtonClick() {
    this._invokeCallback(this._callbacks.onDeletePoint, this._tripPointData);
  }

  _invokeCallback(cFunc, ...params) {
    if (!cFunc) {
      return;
    }
    cFunc(...params);
  }
}
