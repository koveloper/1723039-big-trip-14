import SortView from '../view/sort-menu.js';
import TripPointPresenter from './trip-point.js';
import TripPointsContainerView from '../view/trip-points-container.js';
import TripPointsContainerEmptyView from '../view/trip-points-container-empty.js';
import TripPointEditor from '../view/trip-point-editor.js';
import {renderElement, RenderPosition, removeView} from '../utils/ui.js';
import {SortRules, FiltersRules} from '../app-data.js';
import {ViewValues} from '../constants.js';
import {ViewEvents} from '../view/view-events.js';

export default class TripPresenter {
  constructor({container, tripPointsModel, filtersModel, switchToTableModeCallback}) {
    this._tripContainer = container;
    this._sortView = new SortView();
    this._tripPointsContainerView = new TripPointsContainerView();
    this._noPointsView = new TripPointsContainerEmptyView();
    this._newPointView = new TripPointEditor();
    this._currentSortType = ViewValues.sortTypes.DAY;
    this._tripPointsPresenters = {};
    this._switchToTableModeCallback = switchToTableModeCallback;
    this._currentEditForm = null;

    this._handleTripPointsModelEvent = this._handleTripPointsModelEvent.bind(this);
    this._handleFiltersModelEvent = this._handleFiltersModelEvent.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);
    this._handleCloseNewPointButtonClick = this._handleCloseNewPointButtonClick.bind(this);
    this._handleAddNewPointButtonClick = this._handleAddNewPointButtonClick.bind(this);

    this._handleOpenEditFormEvent = this._handleOpenEditFormEvent.bind(this);
    this._handleCloseEditFormEvent = this._handleCloseEditFormEvent.bind(this);

    this._tripPointsModel = tripPointsModel;
    this._tripPointsModel.addObserver(this._handleTripPointsModelEvent);

    this._filtersModel = filtersModel;
    this._filtersModel.addObserver(this._handleFiltersModelEvent);

    this._newPointView.setEventListener(ViewEvents.uid.DELETE_POINT, this._handleCloseNewPointButtonClick);
    this._newPointView.setEventListener(ViewEvents.uid.SAVE_POINT, this._handleAddNewPointButtonClick);
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

  _handleOpenEditFormEvent(pointIptr) {
    if (this._currentEditForm) {
      this._currentEditForm.setEditModeEnabled(false);
    }
    this._currentEditForm = pointIptr;
    pointIptr.setEditModeEnabled(true);
  }

  _handleCloseEditFormEvent(pointIptr) {
    if (!pointIptr) {
      return;
    }
    this._currentEditForm = null;
    pointIptr.setEditModeEnabled(false);
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
    switch (evt.type) {
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
    if (data.id in this._tripPointsPresenters) {
      this._tripPointsPresenters[data.id].init(data);
    }
  }

  _getTripPoints() {
    return this._tripPointsModel.getTripPoints().slice()
      .filter(FiltersRules.getFilterFunction(this._filtersModel.getFilterType()))
      .sort(SortRules.getSortFunction(this._currentSortType));
  }

  _clearTripPoints() {
    Object.values(this._tripPointsPresenters).forEach((presenter) => presenter.destroy());
    this._tripPointsPresenters = {};
  }

  _renderTrip() {
    this._clearTripPoints();
    const points = this._getTripPoints();
    if (!points.length && this._filtersModel.getFilterType() === ViewValues.filters.EVERYTHING) {
      renderElement(this._tripContainer, this._noPointsView);
      return;
    }
    this._renderSort();
    this._renderTripPoints(points);
  }

  _renderSort() {
    this._sortView.setSortType(this._currentSortType);
    renderElement(this._tripContainer, this._sortView);
    this._sortView.setSortTypeClickCallback(this._handleSortTypeClick);
  }

  _renderTripPoints(points) {
    renderElement(this._tripContainer, this._tripPointsContainerView);
    points.forEach((point) => {
      this._renderTripPoint(point);
    });
  }

  _renderTripPoint(tripPointData) {
    const pointPresenter = new TripPointPresenter({
      containerForTripPoints: this._tripPointsContainerView,
      model: this._tripPointsModel,
      openEditFormCallback: this._handleOpenEditFormEvent,
      closeEditFormCallback: this._handleCloseEditFormEvent,
    });
    this._tripPointsPresenters[tripPointData.id] = pointPresenter;
    pointPresenter.init(tripPointData);
  }

  setAddNewPointMode() {
    this._handleCloseEditFormEvent(this._currentEditForm);
    renderElement(this._tripPointsContainerView, this._newPointView, RenderPosition.AFTERBEGIN);
    this._newPointView.restoreHandlers();
    this._newPointView.setEditModeEnabled = () => this._handleCloseNewPointButtonClick();
    this._currentEditForm = this._newPointView;
    if (this._sortView.getElement().classList.contains('visually-hidden') && this._switchToTableModeCallback) {
      this._switchToTableModeCallback();
    }
  }

  _handleCloseNewPointButtonClick() {
    removeView(this._newPointView);
    this._newPointView.tripPoint = undefined;
    this._currentEditForm = null;
  }

  _handleAddNewPointButtonClick() {
    this._tripPointsModel.addTripPoint(ViewValues.updateType.MINOR, this._newPointView.tripPoint);
    this._handleCloseNewPointButtonClick();
  }
}
