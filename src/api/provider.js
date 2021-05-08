import { isOnline } from '../utils/common.js';
import Api from './api.js';

const DataField = {
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
  POINTS: 'points',
};

export default class Provider {

  constructor({ api, storage }) {
    this._api = api;
    this._storage = storage;
  }

  _getInOnlineMode(apiMethod, itemNameInStorageObject) {
    if (isOnline()) {
      return apiMethod()
        .then((value) => {
          this._storage.save({[itemNameInStorageObject]: value});
          return value;
        });
    }
  }

  _getInOfflineMode(itemNameInStorageObject) {
    return Promise.resolve(this._storage.getAll()[itemNameInStorageObject] || []);
  }

  updateTripPoint(tripPoint) {
    return this._api.updateTripPoint(tripPoint);
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

  deleteTripPoint(tripPoint) {
    return this._api.deleteTripPoint(tripPoint);
  }

  addTripPoint(tripPoint) {
    return this._api.addTripPoint(tripPoint);
  }
}
