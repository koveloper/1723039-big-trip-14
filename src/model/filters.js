import Observer from '../utils/observer.js';
import { ViewValues } from '../constants.js';

export default class FiltersModel extends Observer {

  constructor() {
    super();
    this._currentFilterType = ViewValues.filters.EVERYTHING;
  }

  setFilterType(updateType, filterType) {
    this._currentFilterType = filterType;
    this._notify(updateType, filterType);
  }

  getFilterType() {
    return this._currentFilterType;
  }
}
