export default class Observer {
  constructor() {
    this._callbacks = [];
  }

  addObserver(callback) {
    this._callbacks.push(callback);
  }

  removeObserver(callback) {
    this._callbacks = this._callbacks.filter((l) => l !== callback);
  }

  _notify(eventType, eventData) {
    this._callbacks.forEach((callback) => callback({type: eventType, data: eventData}));
  }
}
