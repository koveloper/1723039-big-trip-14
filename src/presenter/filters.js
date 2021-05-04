import AbstractPresenter from './abstract-presenter.js';
import FiltersView from '../view/filters-menu.js';
import { renderElement, removeView } from '../utils/ui.js';
import { FiltersRules } from '../app-data.js';
import { ViewValues } from '../constants.js';

export default class FiltersPresenter extends AbstractPresenter {
  constructor({container, model}) {
    super(container);
    this._model = model;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChangeFromView = this._handleFilterTypeChangeFromView.bind(this);
    this._model.addObserver(this._handleModelEvent);
    this._view = null;
  }

  _handleModelEvent(evt) {
    if(evt.type === ViewValues.updateType.ERROR) {
      return;
    }
    if(evt.type === ViewValues.updateType.INIT) {
      this.setLoading(false);
    }
  }

  init() {
    if(this.isLoading()) {
      return;
    }
    this.destroy();
    this._view = new FiltersView({
      filerTypes: FiltersRules.getFilters(),
      filterTypeChangeCallback: this._handleFilterTypeChangeFromView,
    });
    this._view.init(this._model.getFilterType());
    this._renderView(this._view);
  }

  _handleFilterTypeChangeFromView(filterType) {
    this._model.setFilterType(ViewValues.updateType.MINOR, filterType);
  }

  destroy() {
    removeView(this._view);
    this._view = null;
  }
}
