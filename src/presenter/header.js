import TripInfoView from '../view/trip-info.js';
import { RenderPosition, renderElement, removeView } from '../utils/ui.js';

export default class HeaderPresenter {
  constructor({container, model}) {
    this._headerContainer = container;
    this._model = model;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._model.addObserver(this._handleModelEvent);
    this._view = null;
  }

  _handleModelEvent() {
    this.init();
  }

  init() {
    this.destroy();
    this._view = new TripInfoView(this._model.getTripPoints().slice());
    renderElement(this._headerContainer, this._view, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    removeView(this._view);
    this._view = null;
  }
}
