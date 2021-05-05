import Observer from '../utils/observer.js';
import {ViewValues} from '../constants.js';

export default class PointsModel extends Observer {
  constructor(api) {
    super();
    this._tripPoints = [];
    this._api = api;
    this._commitError = this._commitError.bind(this);
  }

  setTripPoints(pointsArr) {
    this._tripPoints = pointsArr.slice();
    this._notify(ViewValues.updateType.INIT);
  }

  commitInitError() {
    this._notify(ViewValues.updateType.INIT_ERROR);
  }

  _commitError(data) {
    this._notify(ViewValues.updateType.ERROR, data);
  }

  getTripPoints() {
    return this._tripPoints;
  }

  updateTripPoint(updateType, tripPointData) {
    const index = this._tripPoints.findIndex((item) => item.id === tripPointData.id);

    if (index === -1) {
      throw new Error('Trip point is not exists');
    }
    this._api.updateTripPoint(tripPointData)
      .then((updatedPoint) => {
        this._tripPoints = [
          ...this._tripPoints.slice(0, index),
          updatedPoint,
          ...this._tripPoints.slice(index + 1),
        ];
        this._notify(updateType, updatedPoint);
      }).catch(() => {
        this._commitError(tripPointData);
      });
  }

  deleteTripPoint(updateType, tripPointData) {
    const index = this._tripPoints.findIndex((item) => item.id === tripPointData.id);

    if (index === -1) {
      throw new Error('Trip point is not exists');
    }
    this._api.deleteTripPoint(Object.assign({}, tripPointData))
      .then(() => {
        this._tripPoints = [
          ...this._tripPoints.slice(0, index),
          ...this._tripPoints.slice(index + 1),
        ];
        this._notify(updateType);
      }).catch(() => {
        this._commitError(tripPointData);
      });
  }

  addTripPoint(updateType, tripPointData) {
    if (!tripPointData) {
      return;
    }
    this._api.addTripPoint(Object.assign({}, tripPointData))
      .then((newPoint) => {
        this._tripPoints.push(newPoint);
        this._notify(updateType, newPoint);
      }).catch(() => {
        this._commitError(tripPointData);
      });
  }
}
