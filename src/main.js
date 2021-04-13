import MenuView from './view/menu.js';
import TripInfoView from './view/trip-info.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import TripPointEditorView from './view/trip-point-editor.js';
import TripPointView from './view/trip-point.js';
import TripPointsContainerView from './view/trip-points-container.js';
import TripPointsContainerEmptyView from './view/trip-points-container-empty.js';
// import ViewElementWrapper from './view/view-element-wrapper.js';
import { handlerTypes } from './view/handlers.js';
import { RenderPosition, getComponent, renderElement } from './utils/ui.js';
import { generateTripPointData } from './mock/trip-point.js';
import { ViewValues } from './constants.js';

const testPoints = new Array(20).fill().map(() => generateTripPointData());

const viewItems = {
  menu: new MenuView(),
  tripInfo: new TripInfoView(testPoints),
  filters: new FiltersView(),
  sort: new SortView(),
  tripEventsList: new TripPointsContainerView(),
  tripPoints: testPoints.map((e) => new TripPointView(e)),
  noTripPoints: new TripPointsContainerEmptyView(),
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

// const getViewElementWrapper = (viewElement) => {
//   const finder = (wrapper) => {
//     return wrapper.viewElement === viewElement;
//   };
//   return Object.values(viewItemsWrappers).flatMap((viw) => viw).find(finder)
//     || [...tripPointsEditors.values()].find(finder);
// };

// const viewElementCallback = (e) => {
//   const sourceWrapper = getViewElementWrapper(e.source);
//   switch (e.type) {
//     case 'trip-point-edit':
//       switchToPointEditMode(sourceWrapper);
//       break;
//     case 'trip-point-edit-close':
//       switchToPointViewMode(sourceWrapper);
//       break;
//     case 'trip-point-save':
//       //TODO
//       break;
//     case 'trip-point-delete':
//       //TODO
//       break;
//     default:
//       break;
//   }
// };

// document.addEventListener('keydown', (event) => {
//   if(event.key.toLowerCase() == 'escape') {
//     for(const opened of [...openedTripPoints.values()]) {
//       switchToPointViewMode(opened);
//     }
//   }
// });

// Object.values(viewItemsWrappers).flatMap((v) => v).forEach((el) => {
//   // el.viewElement.addEventListener(viewElementCallback);
// });

function callback(type, caller) {
  console.log(type);
  console.log(caller);
}

// viewItemsWrappers.tripPoints.forEach((el) => el.viewElement.setCallback(handlerTypes.OPEN_POINT_POPUP, callback));

const renderApp = () => {

  // menu: new ViewElementWrapper(ViewValues.selectors.MENU, new MenuView()),
  // tripInfo: new ViewElementWrapper(ViewValues.selectors.INFO, new TripInfoView(testPoints), RenderPosition.AFTERBEGIN),
  // filters: new ViewElementWrapper(ViewValues.selectors.FILTERS, new FiltersView()),
  // sort: new ViewElementWrapper(ViewValues.selectors.SORT, new SortView()),
  // tripEventsList: new ViewElementWrapper(ViewValues.selectors.EVENTS, new TripPointsContainerView()),
  // tripPoints: testPoints.map((e) => new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointView(e))),
  // noTripPoints: new ViewElementWrapper(ViewValues.selectors.POINT_CONTAINER, new TripPointsContainerEmptyView()),

  renderElement(getComponent(ViewValues.selectors.MENU), viewItems.menu);
  renderElement(getComponent(ViewValues.selectors.INFO), viewItems.tripInfo, RenderPosition.AFTERBEGIN);
  renderElement(getComponent(ViewValues.selectors.FILTERS), viewItems.filters);
  renderElement(getComponent(ViewValues.selectors.SORT), viewItems.sort);
  renderElement(getComponent(ViewValues.selectors.EVENTS), viewItems.tripEventsList);
  if(viewItems.tripPoints && viewItems.tripPoints.length) {
    viewItems.tripPoints.forEach((w) => renderElement(viewItems.tripEventsList, w));
  } else {
    renderElement(getComponent(ViewValues.selectors.EVENTS), viewItems.noTripPoints);
  }
};

renderApp();

