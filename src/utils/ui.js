import AbstractViewElement from '../view//abstract-view-element.js';

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const renderElement = (container, element, place = RenderPosition.BEFOREEND) => {
  if(container instanceof AbstractViewElement) {
    container = container.getElement();
  }
  if(element instanceof AbstractViewElement) {
    element = element.getElement();
  }
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const getComponent = (selector) => {
  return document.querySelector(selector);
};

// toggle(newWrapper) {
//   document.querySelector(this._containerSelector).replaceChild(newWrapper.viewElement.getElement(), this.viewElement.getElement());
// }
