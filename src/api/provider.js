import {isOnline} from '../utils/common.js';

const DataField = {
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
  POINTS: 'points',
};

export default class Provider {

  constructor({api, storage}) {
    this._api = api;
    this._storage = storage;
    this._isMustBeSunced = false;
  }

  _getInOnlineMode(apiMethod, itemNameInStorageObject) {
    if (isOnline()) {
      return apiMethod()
        .then((value) => {
          this._storage.save({[itemNameInStorageObject]: value});
          return value;
        });
    }
    return null;
  }

  _getInOfflineMode(itemNameInStorageObject) {
    return Promise.resolve(this._storage.getAll()[itemNameInStorageObject] || []);
  }

  updateTripPoint(tripPoint) {
    if (isOnline()) {
      return this._api.updateTripPoint(tripPoint);
    }
    this._isMustBeSunced = true;
    return this._getInOfflineMode(DataField.POINTS)
      .then((points) => {
        this._storage.save({[DataField.POINTS]: points.map((point) => {
          return point.id === tripPoint.id ? tripPoint : point;
        })});
        return tripPoint;
      });
  }

  getTripPoints() {
    return this._getInOnlineMode(this._api.getTripPoints, DataField.POINTS)
            || this._getInOfflineMode(DataField.POINTS);
  }

  getDestinations() {
    return this._getInOnlineMode(this._api.getDestinations, DataField.DESTINATIONS)
            || this._getInOfflineMode(DataField.DESTINATIONS);
  }

  getOffers() {
    return this._getInOnlineMode(this._api.getOffers, DataField.OFFERS)
            || this._getInOfflineMode(DataField.OFFERS);
  }

  sync() {
    if (!this._isMustBeSunced) {
      return;
    }
    this._api.sync(this._storage.getAll()[DataField.POINTS])
      .then((points) => {
        this._isMustBeSunced = true;
        this._storage.save({[DataField.POINTS]: points});
        return points;
      });
  }

  deleteTripPoint(tripPoint) {
    return this._api.deleteTripPoint(tripPoint);
  }

  addTripPoint(tripPoint) {
    return this._api.addTripPoint(tripPoint);
  }
}
