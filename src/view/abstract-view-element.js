import { createElement } from '../utils/ui.js';

const bindContext = function (context, handlerType, fn) {
  return function (...args) {
    return fn.call(context, handlerType, ...args);
  };
};

export default class AbstractViewElement {
  constructor() {
    if (new.target === AbstractViewElement) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._element = null;
    this._callbacks = {};
    this._handlers = {};
  }

  getTemplate() {
    throw new Error('Method is not supported by child.');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  _handler(handlerType, evt) {
    if(evt) {
      evt.preventDefault();
    }
    if(this._callbacks[handlerType]) {
      this._callbacks[handlerType](handlerType, this);
    }
  }

  _registerHandler(handlerType, component, onEvent) {
    this._unregisterHandler(arguments);
    this._handlers[handlerType] = bindContext(this, handlerType, this._handler);//handler.bind(this);
    component.addEventListener(onEvent, this._handlers[handlerType]);
  }

  _unregisterHandler(handlerType, component, onEvent) {
    if(this._handlers[handlerType]) {
      component.removeEventListener(onEvent, this._handlers[handlerType]);
    }
  }

  setCallback(handlerType, callbackFunction) {
    this._callbacks[handlerType] = callbackFunction;
  }
}
