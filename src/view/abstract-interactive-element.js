import AbstractViewElement from './abstract-view-element.js';
import { toggleView } from '../utils/ui.js';
import { restoreFocus, getFocusObject } from '../utils/ui.js';

const bindEventListenerContext = function (fn, context, handlerType) {
  return function (...args) {
    return fn.call(context, handlerType, ...args);
  };
};

export default class AbstractInteractiveElement extends AbstractViewElement {

  constructor() {
    super();
    this._events = {};
  }

  _wrapAsInternalListener(func, ...eventUID) {
    func = func.bind(this);
    eventUID.forEach((uid) => this.setEventListener(uid, func));
  }

  _performDefaultCallbackOnTextField({event, dataName, stateName, dataCreateFunctionByTextFieldValue, compareWith} = {}) {
    if(event.target.value == compareWith) {
      return;
    }
    const upd = {
      state: {},
    };
    upd[dataName] =  dataCreateFunctionByTextFieldValue(event.target.value);
    upd.state[stateName] = getFocusObject(event.target);
    this.updateData(upd);
  }

  _restoreDefaultTextFields(state, textFieldsArray) {
    if(!state) {
      return;
    }
    textFieldsArray.forEach((inp) => restoreFocus(this.getElement().querySelector(`.event__input--${inp}`), state[inp]));
  }

  restoreHandlers() {
    throw new Error('Method is not supported by child.');
  }

  updateData(update, withoutElementUpdate) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (withoutElementUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    //cache old element
    const old = this.getElement();
    //clear old element data
    this.removeElement();
    //replace with new element
    toggleView(old.parentElement, old, this.getElement());
    //restore handlers
    this.restoreHandlers();
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
      eventHandler: bindEventListenerContext(this._handler, this, handlerUID),
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
