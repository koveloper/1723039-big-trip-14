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
    this._events = {};
    // this._handlers = {};
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

  _handler(handlerUID, evt) {
    if(evt) {
      evt.preventDefault();
    }
    if(this._events[handlerUID].listener) {
      this._events[handlerUID].listener({src: this, eventUID: handlerUID, event: evt});
    }
  }

  _createEventHandler(handlerUID, parent, selector, eventType) {
    const eventHandler = {
      handlerUID,
      selector,
      eventType,
      parent,
      element: parent.querySelector(selector),
      eventHandler: bindContext(this, handlerUID, this._handler),
      registerHandler: function() {
        this.element.addEventListener(this.eventType, this.eventHandler);
      },
      unregisterHandler: function() {
        this.element.removeEventListener(this.eventType, this.eventHandler);
      },
    };
    eventHandler.registerHandler = eventHandler.registerHandler.bind(eventHandler);
    eventHandler.unregisterHandler = eventHandler.unregisterHandler.bind(eventHandler);
    eventHandler.registerHandler();
    return eventHandler;
  }

  _registerEventSupport({handlerUID, parent, selectorInsideParent, eventType} = {}) {
    this._unregisterEventSupport(handlerUID);
    this._events[handlerUID] = Object.assign(
      {},
      this._events[handlerUID],
      this._createEventHandler(
        handlerUID,
        parent,
        selectorInsideParent,
        eventType,
      ),
    );
  }

  _unregisterEventSupport(handlerUID) {
    if(this._events[handlerUID]) {
      this._events[handlerUID].unregisterHandler();
    }
  }

  setEventListener(handlerUID, callbackFunction) {
    this._events[handlerUID] = Object.assign(
      {},
      this._events[handlerUID],
      {
        listener: callbackFunction,
      },
    );
  }
}
