import Observer from '../utils/observer.js';
import {AppConstants} from '../constants.js';

export default class FiltersModel extends Observer {

  constructor() {
    super();
    this._currentFilterType = AppConstants.filter.EVERYTHING;
  }

  init() {
    this._notify(AppConstants.updateType.INIT);
  }

  setFilterType(updateType, filterType) {
    this._currentFilterType = filterType;
    this._notify(updateType, filterType);
  }

  getFilterType() {
    return this._currentFilterType;
  }
}
