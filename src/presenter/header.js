import AbstractPresenter from './abstract-presenter.js';
import TripInfoView from '../view/trip-info-view.js';
import {RenderPosition, removeView} from '../utils/ui.js';
import {AppConstants} from '../constants.js';

export default class HeaderPresenter extends AbstractPresenter {
  constructor({container, tripPointsModel, sortIface}) {
    super(container);
    this._tripPointsModel = tripPointsModel;
    this._sortIface = sortIface;
    this._handleTripPointsModelEvent = this._handleTripPointsModelEvent.bind(this);
    this._tripPointsModel.addObserver(this._handleTripPointsModelEvent);
    this._view = null;
  }

  init() {
    if (this.isLoading()) {
      return;
    }
    this.destroy();
    this._view = new TripInfoView(this._tripPointsModel.getTripPoints().slice().sort(this._sortIface.getSortFunction(AppConstants.sortType.DAY)));
    this._renderView(this._view, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    removeView(this._view);
    this._view = null;
  }

  _handleTripPointsModelEvent(evt) {
    if (evt.type === AppConstants.updateType.INIT) {
      this.setLoading(false);
      return;
    }
    if(evt.type !== AppConstants.updateType.MINOR && evt.type !== AppConstants.updateType.MAJOR) {
      return;
    }
    this.init();
  }
}
