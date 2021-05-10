import AbstractPresenter from './abstract-presenter.js';
import SortView from '../view/sort-view.js';
import TripPointPresenter from './trip-point.js';
import TripPointsContainerView from '../view/trip-points-container-view.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty-view.js';
import TripPointEditorView from '../view/trip-point-editor-view.js';
import Filters from '../app-structures/filters.js';
import Sort from '../app-structures/sort.js';
import {renderElement, RenderPosition, removeView} from '../utils/ui.js';
import {AppConstants} from '../constants.js';
import {ViewEvents} from '../view/view-events.js';
import {TimeUtils} from '../utils/time.js';
import TripPointType from '../app-structures/trip-point-type.js';

export default class TripPresenter extends AbstractPresenter {
  constructor({container, api, tripPointsModel, filtersModel, switchToTableModeCallback}) {
    super(container);
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._newPointView = null;
    this._currentSortType = AppConstants.sortType.DAY;
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
    this._handleKeyboardEvent = this._handleKeyboardEvent.bind(this);
    this._handleExternalEvent = this._handleExternalEvent.bind(this);

    this._tripPointsModel = tripPointsModel;
    this._tripPointsModel.addObserver(this._handleTripPointsModelEvent);

    this._filtersModel = filtersModel;
    this._filtersModel.addObserver(this._handleFiltersModelEvent);

    this._setExternalEventsCallback(this._handleExternalEvent);
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
    this._setKeyboardEventHandler(true);
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

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._renderTrip();
  }

  _handleFiltersModelEvent() {
    this._currentSortType = AppConstants.sortType.DAY;
    this._renderTrip();
  }

  _handleAddNewPointButtonClick() {
    if (this._currentEditForm) {
      this._currentEditForm.setBlock(true);
    }
    const pointFromForm = this._newPointView.getTripPoint();
    this._api.addTripPoint(Object.assign({}, pointFromForm))
      .then((newPoint) => {
        this._tripPointsModel.addTripPoint(AppConstants.updateType.MAJOR, newPoint);
      }).catch(() => {
        this._commitError(pointFromForm);
      });
  }

  _handleCloseNewPointButtonClick() {
    if (!this._newPointView) {
      return;
    }
    removeView(this._newPointView);
    this._newPointView.setTripPoint(undefined);
    this._currentEditForm = null;
    this._setKeyboardEventHandler(false);
    if(!this._tripPointsModel.getTripPoints().length) {
      this._renderView(this._noPointsView);
    }
  }

  _handleOpenEditFormEvent(pointIptr) {
    if (this._currentEditForm) {
      this._currentEditForm.setEditModeEnabled(false);
    }
    this._currentEditForm = pointIptr;
    pointIptr.setEditModeEnabled(true);
    this._setKeyboardEventHandler(true);
  }

  _handleCloseEditFormEvent(pointIptr) {
    if (!pointIptr) {
      return;
    }
    this._currentEditForm = null;
    pointIptr.setEditModeEnabled(false);
    this._setKeyboardEventHandler(false);
  }

  _setKeyboardEventHandler(isHandlerEnabled) {
    if(isHandlerEnabled) {
      document.addEventListener('keyup', this._handleKeyboardEvent);
      return;
    }
    document.removeEventListener('keyup', this._handleKeyboardEvent);
  }

  _handleKeyboardEvent(evt) {
    if(evt.keyCode === AppConstants.keyboard.ESC_KEY_CODE) {
      if(this._currentEditForm === this._newPointView) {
        this._handleCloseNewPointButtonClick();
      } else {
        this._handleCloseEditFormEvent(this._currentEditForm);
      }
    }
  }

  _handleExternalEvent(evt) {
    if (evt.type === AppConstants.externalEvent.ONLINE) {
      Object.values(this._tripPointsPresenters).forEach((point) => point.setOnlineMode(evt.data));
    }
  }

  _getUpdateType(point) {
    const currPointsArray = this._tripPointsModel.getTripPoints().slice().sort(Sort.getSortFunction(AppConstants.sortType.DAY));
    const prevPoint = currPointsArray.find((p) => p.id === point.id);
    // first event is updated - so it is a MINOR (header must be updated)
    if(TimeUtils.compare(currPointsArray[0].dateFrom, point.dateFrom) > 0) {
      return AppConstants.updateType.MINOR;
    }
    // first event is updated - so it is a MINOR (header must be updated)
    if(TimeUtils.compare(currPointsArray[currPointsArray.length - 1].dateTo, point.dateTo) < 0) {
      return AppConstants.updateType.MINOR;
    }
    // point price is changed - so it is a MINOR (header must be updated)
    if(TripPointType.getPointCost(point) !== TripPointType.getPointCost(prevPoint)) {
      return AppConstants.updateType.MINOR;
    }
    return AppConstants.updateType.PATCH;
  }

  _handleUpdateTripPointEvent(point) {
    if (this._currentEditForm) {
      this._currentEditForm.setBlock(true);
    }
    const updateType = this._getUpdateType(point);
    this._api.updateTripPoint(Object.assign({}, point))
      .then((updatedPoint) => {
        this._tripPointsModel.updateTripPoint(updateType, updatedPoint);
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
        this._tripPointsModel.deleteTripPoint(AppConstants.updateType.MAJOR, point);
      }).catch(() => {
        this._tripPointsModel.commitError(point);
      });
  }

  _handleTripPointsModelEvent(evt) {
    if (evt.type === AppConstants.updateType.INIT_ERROR) {
      removeView(this._noPointsView);
      this._noPointsView.setLoadingState(AppConstants.loadState.ERROR);
      this.setLoading(true);
      return;
    }
    if (evt.type === AppConstants.updateType.ERROR) {
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
      case AppConstants.updateType.PATCH:
        if (evt.data.id in this._tripPointsPresenters) {
          this._tripPointsPresenters[evt.data.id].init(evt.data);
        }
        break;

      case AppConstants.updateType.MINOR:
      case AppConstants.updateType.MAJOR:
        this._renderTrip();
        break;

      case AppConstants.updateType.INIT:
        this._noPointsView.setLoadingState(AppConstants.loadState.LOAD_DONE);
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
}
