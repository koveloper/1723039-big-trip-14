import { updateItem, deleteItem } from '../utils/common.js';
import { ModelEvent } from './model-events.js';

export default class Model {
  constructor() {
    this._tripPoints = [];
    this._callbacks = [];
  }

  setTripPoints(pointsArr) {
    this._tripPoints = pointsArr.slice();
  }

  getTripPoints() {
    return this._tripPoints;
  }

  addCallback(callback) {
    this._callbacks.push(callback);
  }

  removeCallbackr(callback) {
    this._callbacks = this._callbacks.filter((l) => l !== callback);
  }

  updateTripPoint(tripPoint) {
    this._tripPoints = updateItem(this._tripPoints, tripPoint);
    const update = this._tripPoints.find((p) => p.id === tripPoint.id);
    for(const l of this._callbacks) {
      l({type: ModelEvent.UPDATE_TRIP_POINT, data: update});
    }
  }

  deleteTripPoint(tripPoint) {
    this._tripPoints = deleteItem(this._tripPoints, tripPoint);
    for(const l of this._callbacks) {
      l({type: ModelEvent.UPDATE_TRIP, data: this._tripPoints});
    }
  }
}
