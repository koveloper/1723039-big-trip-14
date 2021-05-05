import AbstractPresenter from './abstract-presenter.js';
import TripInfoView from '../view/trip-info.js';
import {RenderPosition, removeView} from '../utils/ui.js';
import {ViewValues} from '../constants.js';

export default class HeaderPresenter extends AbstractPresenter {
  constructor({container, model}) {
    super(container);
    this._model = model;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._model.addObserver(this._handleModelEvent);
    this._view = null;
  }

  _handleModelEvent(evt) {
    if (evt.type === ViewValues.updateType.ERROR) {
      return;
    }
    if (evt.type === ViewValues.updateType.INIT) {
      this.setLoading(false);
      return;
    }
    this.init();
  }

  init() {
    if (this.isLoading()) {
      return;
    }
    this.destroy();
    this._view = new TripInfoView(this._model.getTripPoints().slice());
    this._renderView(this._view, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    removeView(this._view);
    this._view = null;
  }
}
