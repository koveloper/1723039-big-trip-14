import MenuView from './view/Menu.js';
import TripInfoView from './view/TripInfo.js';
import FiltersView from './view/Filters.js';
import SortView from './view/Sort.js';
import TripPointEditorView from './view/TripPointEditor.js';
import TripPointView from './view/TripPoint.js';
import TripPointsContainerView from './view/TripPointsContainer.js';
import TripPointsContainerEmptyView from './view/TripPointsContainerEmpty.js';
import ViewElementWrapper from './view/ViewElementWrapper.js';
import { RenderPosition } from './utils.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const testPoints = new Array(20).fill().map(() => generateTripPointData());

const viewItemsWrappers = {
  menu: new ViewElementWrapper(ViewValues.selectors.MENU, new MenuView()),
  tripInfo: new ViewElementWrapper(ViewValues.selectors.INFO, new TripInfoView(testPoints), RenderPosition.AFTERBEGIN),
  filters: new ViewElementWrapper(ViewValues.selectors.FILTERS, new FiltersView()),
  sort: new ViewElementWrapper(ViewValues.selectors.SORT, new SortView()),
  tripEventsList: new ViewElementWrapper(ViewValues.selectors.EVENTS, new TripPointsContainerView()),
  tripPoints: testPoints.map((e) => new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointView(e))),
  noTripPoints: new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointsContainerEmptyView()),
};

const tripPointsEditors = new Map();
const openedTripPoints = new Set();

const switchToPointViewMode = (sourceWrapper) => {
  for(const entry of tripPointsEditors) {
    if(entry[1] === sourceWrapper) {
      sourceWrapper.toggle(entry[0]);
      return;
    }
  }
  openedTripPoints.delete(sourceWrapper);
};

const switchToPointEditMode = (sourceWrapper) => {
  if (!tripPointsEditors.has(sourceWrapper)) {
    const editor = new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointEditorView(sourceWrapper.viewElement.tripPoint));
    editor.viewElement.addEventListener(viewElementCallback);
    tripPointsEditors.set(sourceWrapper, editor);
  }
  sourceWrapper.toggle(tripPointsEditors.get(sourceWrapper));
  openedTripPoints.add(tripPointsEditors.get(sourceWrapper));
};

const getViewElementWrapper = (viewElement) => {
  const finder = (wrapper) => {
    return wrapper.viewElement === viewElement;
  };
  return Object.values(viewItemsWrappers).flatMap((viw) => viw).find(finder)
    || [...tripPointsEditors.values()].find(finder);
};

const viewElementCallback = (e) => {
  const sourceWrapper = getViewElementWrapper(e.source);
  switch (e.type) {
    case 'trip-point-edit':
      switchToPointEditMode(sourceWrapper);
      break;
    case 'trip-point-edit-close':
      switchToPointViewMode(sourceWrapper);
      break;
    
	case 'trip-point-save':
      //TODO
      break;
    case 'trip-point-delete':
      //TODO
      break;
	  
    default:
      break;
  }
};

document.addEventListener('keydown', (event) => {
  if(event.key.toLowerCase() == 'escape') {
    for(const opened of [...openedTripPoints.values()]) {
      switchToPointViewMode(opened);
    }
  }
});

Object.values(viewItemsWrappers).flatMap((v) => v).forEach((el) => {
  el.viewElement.addEventListener(viewElementCallback);
});

const renderApp = () => {
  viewItemsWrappers.menu.render();
  viewItemsWrappers.tripInfo.render();
  viewItemsWrappers.filters.render();
  viewItemsWrappers.sort.render();
  viewItemsWrappers.tripEventsList.render();
  if(viewItemsWrappers.tripPoints && viewItemsWrappers.tripPoints.length) {
    viewItemsWrappers.tripPoints.forEach((w) => w.render());
  } else {
    viewItemsWrappers.noTripPoints.render();
  }
};

renderApp();

