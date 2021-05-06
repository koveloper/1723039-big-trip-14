import {ViewValues} from '../constants.js';

const pointTypes = ViewValues.pointTypes.map((v) => {
  return {
    title: v.name,
    offers: [],
    isInMotion: v.isInMotion,
  };
});

const getPointTypes = () => pointTypes;

const getPointTypeByIndex = (i) => pointTypes[i];

const getPointTypeByTitle = (title) => pointTypes.find((v) => v.title.toLowerCase() === title.toLowerCase());

const setOffers = (title, offers) => {
  getPointTypeByTitle(title).offers = [...offers].map((offer) => Object.assign({}, offer));
};

const getOffers = (title) => {
  const {
    offers = [],
  } = getPointTypeByTitle(title);
  return offers;
};

const TripPointType = {
  getPointTypes,
  getPointTypeByIndex,
  getPointTypeByTitle,
  setOffers,
  getOffers,
};

export default TripPointType;
