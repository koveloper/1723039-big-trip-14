export default class Store {

  constructor({key, storage}) {
    this._key = key;
    this._storage = storage;
  }

  save(update) {
    this._storage.setItem(
      this._key,
      JSON.stringify(Object.assign(this.getAll(), update)),
    );
  }

  getAll() {
    return JSON.parse(this._storage.getItem(this._key)) || {};
  }
}
