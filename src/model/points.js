import Observer from '../utils/observer.js';

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._tripPoints = [];
  }

  setTripPoints(pointsArr) {
    this._tripPoints = pointsArr.slice();
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

  deleteTripPoint(updateType, tripPointForDelete) {
    const index = this._tripPoints.findIndex((item) => item.id === tripPointForDelete.id);

    if (index === -1) {
      throw new Error('Trip point is not exists');
    }

    this._tripPoints = [
      ...this._tripPoints.slice(0, index),
      ...this._tripPoints.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
