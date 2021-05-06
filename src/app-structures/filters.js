import {ViewValues} from '../constants.js';
import {TimeUtils} from '../utils/time.js';

const filters = Object.values(ViewValues.filters);
const filtersFunctions = {
  [ViewValues.filters.EVERYTHING]: () => true,
  [ViewValues.filters.FUTURE]: (point) => TimeUtils.isInFuture(point.dateFrom) || TimeUtils.isCurrent(point.dateFrom, point.dateTo),
  [ViewValues.filters.PAST]: (point) => TimeUtils.isInPast(point.dateTo) || TimeUtils.isCurrent(point.dateFrom, point.dateTo),
};

const Filters = {
  getFilters: () => filters,
  getFiltersFunctions: () => filtersFunctions,
  getFilterFunction: (filterType) => filtersFunctions[filterType],
};

export default Filters;
