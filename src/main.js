import MenuView from './view/Menu.js';
import TripInfoView from './view/TripInfo.js';
import FiltersView from './view/Filters.js';
import SortView from './view/Sort.js';
import TripPointEditorView from './view/TripPointEditor.js';
import TripPointView from './view/TripPoint.js';
import TripPointsContainerView from './view/TripPointsContainer.js';
import RenderUnit from './RenderUnit.js';
import ViewElementWrapper from './view/ViewElementWrapper.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const testPoints = new Array(20).fill().map(() => generateTripPointData());

const viewItemsWrappers = {
  menu: new ViewElementWrapper(ViewValues.selectors.MENU, new MenuView()),
  tripInfo: new ViewElementWrapper(ViewValues.selectors.INFO, new TripInfoView(testPoints), RenderUnit.getRenderPostions().AFTERBEGIN),
  filters: new ViewElementWrapper(ViewValues.selectors.FILTERS, new FiltersView()),
  sort: new ViewElementWrapper(ViewValues.selectors.SORT, new SortView()),
  tripEventsList: new ViewElementWrapper(ViewValues.selectors.EVENTS, new TripPointsContainerView()),
  tripPoints: testPoints.map((e) => new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointView(e))),
};

const tripPointsEditors = new Map();


const switchToPointViewMode = (sourceWrapper) => {
  for(const entry of tripPointsEditors) {
    if(entry[1] === sourceWrapper) {
      sourceWrapper.toggle(entry[0]);
      return;
    }
  }
};

const switchToPointEditMode = (sourceWrapper) => {
  if (!tripPointsEditors.has(sourceWrapper)) {
    const editor = new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointEditorView(sourceWrapper.viewElement.tripPoint));
    editor.viewElement.addEventListener(viewElementCallback);
    tripPointsEditors.set(sourceWrapper, editor);
  }
  sourceWrapper.toggle(tripPointsEditors.get(sourceWrapper));
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

Object.values(viewItemsWrappers).flatMap((v) => v).forEach((el) => {
  el.viewElement.addEventListener(viewElementCallback);
  el.render();
});
