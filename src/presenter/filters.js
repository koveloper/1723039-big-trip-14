import FiltersView from '../view/filters.js';
import { renderElement, removeView } from '../utils/ui.js';
import { FiltersRules } from '../app-data.js';

export default class FiltersPresenter {
  constructor({container, model}) {
    this._container = container;
    this._model = model;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChangeFromView = this._handleFilterTypeChangeFromView.bind(this);
    this._model.addObserver(this._handleModelEvent);
    this._view = null;
  }

  _handleModelEvent() {
    // this.init();
  }

  init() {
    this.destroy();
    this._view = new FiltersView({
      filerTypes: FiltersRules.getFilters(),
      filterTypeChangeCallback: this._handleFilterTypeChangeFromView,
    });
    renderElement(this._container, this._view);
  }

  _handleFilterTypeChangeFromView(filterType) {
    console.log(filterType);
  }

  destroy() {
    removeView(this._view);
    this._view = null;
  }
}
