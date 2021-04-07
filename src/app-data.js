import { ViewValues } from './constants.js';

const createPointType = (title, isInMotion = true) => {
  return {
    title,
    type: title.toLowerCase(),
    offers: [],
    isInMotion,
  };
};

class AppData {
  constructor() {
    this.pointTypes_ = ViewValues.pointTypes.map((v) => createPointType(v.name, v.isInMotion));
    this.filters_ = ViewValues.filters;
    this.sortTypes_ = ViewValues.sortTypes;
    this.cityListObject_ = {};
    this.cityList_ = [];
  }

  get pointTypes() {
    return this.pointTypes_;
  }

  get filters() {
    return this.filters_;
  }

  get sortTypes() {
    return this.sortTypes_;
  }

  get cityList() {
    return this.cityList_;
  }
  getPointTypeByTypeName(type) {
    return this.pointTypes_.find((v) => v.type === type);
  }

  getPointTypeByTitle(title) {
    return this.pointTypes_.find((v) => v.title === title);
  }

  setOffersByTypeName(type, offers) {
    const t = this.getPointTypeByTypeName(type);
    if(t) {
      t.offers = [...offers];
    }
  }

  setOffersByTypeTitle(title, offers) {
    const t = this.getPointTypeByTitle(title);
    if(t) {
      t.offers = [...offers];
    }
  }

  getOffersByTypeName(type) {
    const {
      offers = [],
    } = this.getPointTypeByTypeName(type);
    return offers;
  }

  getOffersByTitle(title) {
    const {
      offers = [],
    } = this.getPointTypeByTitle(title);
    return offers;
  }

  addCity({name, description = '', pictures = []} = {}) {
    if(name) {
      this.cityListObject_[`${name}`] = {
        description,
        pictures,
      };
      const c = this.cityList_.find((v) => v.name === name);
      if(c) {
        this.cityList_[this.cityList_.indexOf(c)] = {name, description, pictures};
      } else {
        this.cityList_.push({name, description, pictures});
      }

    }
  }

  getCity(name) {
    return `${name}` in this.cityListObject_ ? this.cityListObject_[`${name}`] : undefined;
  }

  getCityPictures(name) {
    const {
      pictures = [],
    } = this.getCity(name);
    return pictures;
  }

  getCityDescription(name) {
    const {
      description = [],
    } = this.getCity(name);
    return description;
  }
}

export const appData = new AppData();
