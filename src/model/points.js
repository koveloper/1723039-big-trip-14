import Observer from '../utils/observer.js';
import {nanoid} from 'nanoid';
import {ViewValues} from '../constants.js';

export default class PointsModel extends Observer {
  constructor(api) {
    super();
    this._tripPoints = [];
    this._api = api;
  }

  setTripPoints(pointsArr) {
    this._tripPoints = pointsArr.slice();
    this._notify(ViewValues.updateType.INIT);
  }

  commitError() {
    this._notify(ViewValues.updateType.ERROR);
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

      });
  }

  deleteTripPoint(updateType, tripPointForDelete) {
    const index = this._tripPoints.findIndex((item) => item.id === tripPointForDelete.id);

    if (index === -1) {
      throw new Error('Trip point is not exists');
    }
    this._api.deleteTripPoint(Object.assign({}, tripPointForDelete))
      .then(() => {
        this._tripPoints = [
          ...this._tripPoints.slice(0, index),
          ...this._tripPoints.slice(index + 1),
        ];
        this._notify(updateType);
      }).catch(() => {
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

      });
  }
}
