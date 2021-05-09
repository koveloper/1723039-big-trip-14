import Observer from '../utils/observer.js';
import {AppConstants} from '../constants.js';

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._tripPoints = [];
  }

  setTripPoints(pointsArr) {
    this._tripPoints = pointsArr.slice();
    this._notify(AppConstants.updateType.INIT);
  }

  commitInitError() {
    this._notify(AppConstants.updateType.INIT_ERROR);
  }

  commitError(data) {
    this._notify(AppConstants.updateType.ERROR, data);
  }

  getTripPoints() {
    return this._tripPoints;
  }

  updateTripPoint(updateType, tripPointData) {
    const index = this._tripPoints.findIndex((item) => item.id === tripPointData.id);

    if (index === -1) {
      throw new Error('Trip point is not exists');
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      tripPointData,
      ...this._tripPoints.slice(index + 1),
    ];

    this._notify(updateType, tripPointData);
  }

  deleteTripPoint(updateType, tripPointData) {
    const index = this._tripPoints.findIndex((item) => item.id === tripPointData.id);

    if (index === -1) {
      throw new Error('Trip point is not exists');
    }
    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      ...this._tripPoints.slice(index + 1),
    ];
    this._notify(updateType);
  }

  addTripPoint(updateType, tripPointData) {
    if (!tripPointData) {
      return;
    }
    this._tripPoints.push(tripPointData);
    this._notify(updateType, tripPointData);
  }
}
