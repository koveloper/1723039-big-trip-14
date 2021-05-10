import {AppConstants} from '../constants.js';
import {TimeUtils} from '../utils/time.js';

const filters = Object.values(AppConstants.filter);
const filtersFunctions = {
  [AppConstants.filter.EVERYTHING]: () => true,
  [AppConstants.filter.FUTURE]: (point) => TimeUtils.isInFuture(point.dateFrom) || TimeUtils.isCurrent(point.dateFrom, point.dateTo),
  [AppConstants.filter.PAST]: (point) => TimeUtils.isInPast(point.dateTo) || TimeUtils.isCurrent(point.dateFrom, point.dateTo),
};

const Filters = {
  getFilters: () => filters,
  getFiltersFunctions: () => filtersFunctions,
  getFilterFunction: (filterType) => filtersFunctions[filterType],
};

export default Filters;
