import AbstractPresenter from './abstract-presenter.js';
import SortView from '../view/sort-menu.js';
import TripPointPresenter from './trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import TripPointEditorView from '../view/trip-point-editor.js';
import Filters from '../app-structures/filters.js';
import Sort from '../app-structures/sort.js';
import {renderElement, RenderPosition, removeView} from '../utils/ui.js';
import {ViewValues} from '../constants.js';
import {ViewEvents} from '../view/view-events.js';

export default class TripPresenter extends AbstractPresenter {
  constructor({container, api, tripPointsModel, filtersModel, switchToTableModeCallback}) {
    super(container);
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._newPointView = null;
    this._currentSortType = ViewValues.sortTypes.DAY;
    this._tripPointsPresenters = {};
    this._switchToTableModeCallback = switchToTableModeCallback;
    this._currentEditForm = null;
    this._api = api;

    this._handleTripPointsModelEvent = this._handleTripPointsModelEvent.bind(this);
    this._handleFiltersModelEvent = this._handleFiltersModelEvent.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);
    this._handleCloseNewPointButtonClick = this._handleCloseNewPointButtonClick.bind(this);
    this._handleAddNewPointButtonClick = this._handleAddNewPointButtonClick.bind(this);

    this._handleOpenEditFormEvent = this._handleOpenEditFormEvent.bind(this);
    this._handleCloseEditFormEvent = this._handleCloseEditFormEvent.bind(this);
    this._handleUpdateTripPointEvent = this._handleUpdateTripPointEvent.bind(this);
    this._handleDeleteTripPointEvent = this._handleDeleteTripPointEvent.bind(this);
    this._handleExternalEvent = this._handleExternalEvent.bind(this);
    this._setForKeyboardEventHandler = this._setForKeyboardEventHandler.bind(this);
    this._keyboardEventHandler = this._keyboardEventHandler.bind(this);

    this._tripPointsModel = tripPointsModel;
    this._tripPointsModel.addObserver(this._handleTripPointsModelEvent);

    this._filtersModel = filtersModel;
    this._filtersModel.addObserver(this._handleFiltersModelEvent);
    this._setExternalEventsCallback(this._handleExternalEvent);
  }

  setAddNewPointMode() {
    this._handleCloseEditFormEvent(this._currentEditForm);
    if(!this._tripPointsModel.getTripPoints().length) {
      removeView(this._noPointsView);
      this._renderView(this._tripPointsContainerView);
    }
    renderElement(this._tripPointsContainerView, this._newPointView, RenderPosition.AFTERBEGIN);
    this._newPointView.restoreHandlers();
    this._newPointView.setEditModeEnabled = () => this._handleCloseNewPointButtonClick();
    this._currentEditForm = this._newPointView;
    if (this._sortView.getElement().classList.contains('visually-hidden') && this._switchToTableModeCallback) {
      this._switchToTableModeCallback();
    }
    this._setForKeyboardEventHandler(true);
  }

  init() {
    this._renderTrip();
  }

  setVisible(isVisible) {
    if (isVisible) {
      this._sortView.getElement().classList.remove('visually-hidden');
      this._tripPointsContainerView.getElement().classList.remove('visually-hidden');
    } else {
      this._sortView.getElement().classList.add('visually-hidden');
      this._tripPointsContainerView.getElement().classList.add('visually-hidden');
    }
  }

  _setForKeyboardEventHandler(isHandlerEnabled) {
    if(isHandlerEnabled) {
      document.addEventListener('keyup', this._keyboardEventHandler);
    } else {
      document.removeEventListener('keyup', this._keyboardEventHandler);
    }
  }

  _keyboardEventHandler(evt) {
    if(evt.keyCode === 27) {//ESC
      if(this._currentEditForm === this._newPointView) {
        this._handleCloseNewPointButtonClick();
      } else {
        this._handleCloseEditFormEvent(this._currentEditForm);
      }
    }
  }

  _handleExternalEvent(evt) {
    if (evt.type === ViewValues.externalEvent.ONLINE) {
      Object.values(this._tripPointsPresenters).forEach((point) => point.setOnlineMode(evt.data));
    }
  }

  _handleUpdateTripPointEvent(point) {
    if (this._currentEditForm) {
      this._currentEditForm.setBlock(true);
    }
    this._api.updateTripPoint(Object.assign({}, point))
      .then((updatedPoint) => {
        this._tripPointsModel.updateTripPoint(ViewValues.updateType.PATCH, updatedPoint);
      }).catch(() => {
        this._tripPointsModel.commitError(point);
      });
  }

  _handleDeleteTripPointEvent(point) {
    if (this._currentEditForm) {
      this._currentEditForm.setBlock(true);
    }
    this._api.deleteTripPoint(Object.assign({}, point))
      .then(() => {
        this._tripPointsModel.deleteTripPoint(ViewValues.updateType.MINOR, point);
      }).catch(() => {
        this._tripPointsModel.commitError(point);
      });
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // cache sort type and call render
    this._currentSortType = sortType;
    this._renderTrip();
  }

  _handleFiltersModelEvent() {
    this._currentSortType = ViewValues.sortTypes.DAY;
    this._renderTrip();
  }

  _handleTripPointsModelEvent(evt) {
    if (evt.type === ViewValues.updateType.INIT_ERROR) {
      removeView(this._noPointsView);
      this._noPointsView.setLoadingState(ViewValues.loadStates.ERROR);
      this.setLoading(true);
      return;
    }
    if (evt.type === ViewValues.updateType.ERROR) {
      if (this._currentEditForm) {
        this._currentEditForm.unlockWithError();
      } else {
        if (evt.data.id in this._tripPointsPresenters) {
          this._tripPointsPresenters[evt.data.id].unlockWithError();
        }
      }
      return;
    }

    if (this._currentEditForm) {
      this._currentEditForm.setBlock(false);
    }
    this._handleCloseEditFormEvent(this._currentEditForm);
    this._handleCloseNewPointButtonClick();
    switch (evt.type) {
      case ViewValues.updateType.PATCH:
        this._updateTripPointPresenterData(evt.data);
        break;

      case ViewValues.updateType.MINOR:
      case ViewValues.updateType.MAJOR:
        this._renderTrip();
        break;

      case ViewValues.updateType.INIT:
        this._noPointsView.setLoadingState(ViewValues.loadStates.LOAD_DONE);
        removeView(this._noPointsView);
        this._newPointView = new TripPointEditorView();
        this._newPointView.setEventListener(ViewEvents.uid.DELETE_POINT, this._handleCloseNewPointButtonClick);
        this._newPointView.setEventListener(ViewEvents.uid.SAVE_POINT, this._handleAddNewPointButtonClick);
        this.setLoading(false);
        break;

      default:
        break;
    }
  }

  _updateTripPointPresenterData(data) {
    if (data.id in this._tripPointsPresenters) {
      this._tripPointsPresenters[data.id].init(data);
    }
  }

  _getTripPoints() {
    return this._tripPointsModel.getTripPoints().slice()
      .filter(Filters.getFilterFunction(this._filtersModel.getFilterType()))
      .sort(Sort.getSortFunction(this._currentSortType));
  }

  _clearTripPoints() {
    Object.values(this._tripPointsPresenters).forEach((presenter) => presenter.destroy());
    this._tripPointsPresenters = {};
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderView(this._noPointsView);
      return;
    }
    this._clearTripPoints();
    const points = this._getTripPoints();
    if (!this._tripPointsModel.getTripPoints().length) {
      this._renderView(this._noPointsView);
      removeView(this._sortView);
      return;
    }
    removeView(this._noPointsView);
    this._renderSort();
    this._renderTripPoints(points);
  }

  _renderSort() {
    this._renderView(this._sortView);
    this._sortView.setSortType(this._currentSortType);
    this._sortView.setSortTypeClickCallback(this._handleSortTypeClick);
  }

  _renderTripPoints(points) {
    this._renderView(this._tripPointsContainerView);
    points.forEach((point) => {
      this._renderTripPoint(point);
    });
  }

  _renderTripPoint(tripPointData) {
    const pointPresenter = new TripPointPresenter({
      containerForTripPoints: this._tripPointsContainerView,
      openEditFormCallback: this._handleOpenEditFormEvent,
      closeEditFormCallback: this._handleCloseEditFormEvent,
      updatePointDataCallback: this._handleUpdateTripPointEvent,
      deletePointCallback: this._handleDeleteTripPointEvent,
    });
    this._tripPointsPresenters[tripPointData.id] = pointPresenter;
    pointPresenter.init(tripPointData);
  }

  _handleOpenEditFormEvent(pointIptr) {
    if (this._currentEditForm) {
      this._currentEditForm.setEditModeEnabled(false);
    }
    this._currentEditForm = pointIptr;
    pointIptr.setEditModeEnabled(true);
    this._setForKeyboardEventHandler(true);
  }

  _handleCloseEditFormEvent(pointIptr) {
    if (!pointIptr) {
      return;
    }
    this._currentEditForm = null;
    pointIptr.setEditModeEnabled(false);
    this._setForKeyboardEventHandler(false);
  }

  _handleCloseNewPointButtonClick() {
    if (!this._newPointView) {
      return;
    }
    removeView(this._newPointView);
    this._newPointView.tripPoint = undefined;
    this._currentEditForm = null;
    this._setForKeyboardEventHandler(false);
    if(!this._tripPointsModel.getTripPoints().length) {
      this._renderView(this._noPointsView);
    }
  }

  _handleAddNewPointButtonClick() {
    if (this._currentEditForm) {
      this._currentEditForm.setBlock(true);
    }
    const pointFromForm = this._newPointView.tripPoint;
    this._api.addTripPoint(Object.assign({}, pointFromForm))
      .then((newPoint) => {
        this._tripPointsModel.addTripPoint(ViewValues.updateType.MAJOR, newPoint);
      }).catch(() => {
        this._commitError(pointFromForm);
      });
  }
}
