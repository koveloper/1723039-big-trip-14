const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

const AdapterRools = {
  'base_price': 'basePrice',
  'date_from': 'dateFrom',
  'date_to': 'dateTo',
  'is_favorite': 'isFavorite',
};

const AdapterRoolsReversed = {};

Object.keys(AdapterRools).forEach((backendKey) => {
  AdapterRoolsReversed[AdapterRools[backendKey]] = backendKey;
});

export default class Api {

  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  updateTripPoint(tripPoint) {
    return this._request({
      url: `points/${tripPoint.id}`,
      body: Api.adaptToBack(tripPoint),
      method: Method.PUT,
      headers: new Headers({'Content-Type': 'application/json'}),
    });
  }

  getTripPoints() {
    return this._request({url: 'points'});
  }

  getDestinations() {
    return this._request({url: 'destinations'});
  }

  getOffers() {
    return this._request({url: 'offers'});
  }

  _request({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers},
    )
      .then(Api.checkStatus)
      .then(Api.toJSON)
      .then(Api.adaptToFront)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static _changeKeys(initJsonObj, keysToChange) {
    if (Array.isArray(initJsonObj)) {
      const jsonObj = [];
      for (let i = 0; i < initJsonObj.length; i++) {
        jsonObj[i] = Api._changeKeys(initJsonObj[i], keysToChange);
      }
      return jsonObj;
    }
    const jsonObj = Object.assign({}, initJsonObj);
    Object.keys(keysToChange).forEach((key) => {
      if (key in jsonObj) {
        jsonObj[keysToChange[key]] = jsonObj[key];
        delete jsonObj[key];
      }
    });
    return jsonObj;
  }

  static adaptToFront(jsonObj) {
    return Api._changeKeys(jsonObj, AdapterRools);
  }

  static adaptToBack(jsonObj) {
    return JSON.stringify(Api._changeKeys(jsonObj, AdapterRoolsReversed));
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
