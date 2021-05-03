import { TripPointRules, CityRules } from '../app-data.js';
import { nanoid } from 'nanoid';

const generateRandomInt = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));
  return Math.floor(min + (Math.random() * (max - min)));
};

const generatePointType = () => {
  return TripPointRules.getPointTypes()[generateRandomInt(TripPointRules.getPointTypes().length)];
};

const generateCity = () => {
  return CityRules.getCityList()[generateRandomInt(0, CityRules.getCityList().length)];
};

const generateRandomWord = (wordSize) => {
  let str = '';
  for(let i = 0; i < wordSize; i++) {
    str += String.fromCharCode(generateRandomInt(0x61, 0x7a));
  }
  return str;
};

const generateOffers = (pointType) => {
  const opts = [];
  const offers = TripPointRules.getOffersByTypeName(pointType);
  const offset = generateRandomInt(0, offers.length);
  const size = generateRandomInt(0, offers.length);
  for(let i = 0; i < size; i++) {
    opts.push(offers[(offset + i) % offers.length]);
  }
  return opts;
};

const generateDescription = () => {
  const templates = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus'.split(/\.\s/gm);
  let result = '';
  const size = templates.length;
  for(let i = 0; i < generateRandomInt(1, 5); i++) {
    const num = generateRandomInt(0, size);
    result += templates[num % templates.length] + '. ';
    templates.splice(num % templates.length);
  }
  return result;
};

const generatePictures = () => {
  const arr = [];

  for(let i = 0; i < generateRandomInt(4, 10); i++) {
    arr.push({
      src: `http://picsum.photos/300/200?r=${Math.random()}`,
      description: generateWordSequence(generateRandomInt(2, 5)),
    });
  }
  return arr;
};

const generatePointId = () => {
  return nanoid();
};

const generateWordSequence = (maxWords) => {
  let seq = '';
  for(let i = 0; i < maxWords; i++) {
    seq += (seq.length ? ' ' : '') + generateRandomWord(generateRandomInt(7, 15));
  }
  return seq;
};

let lastDate = null;
const generateDate = (maxDiffInDays = 1) => {
  if(lastDate === null) {
    lastDate = new Date();
    lastDate = new Date(lastDate.getTime() - (generateRandomInt(0, 40 * 24 * 3600 * 1000)));
  }
  lastDate = new Date(lastDate.getTime() + (generateRandomInt(1800, maxDiffInDays * 24 * 3600 * 1000)));
  return lastDate.toISOString();
};

const generateFavorite = () => {
  return Math.random() > 0.5;
};

(() => {
  for(const tripPointType of TripPointRules.getPointTypes()) {
    const offers = [];
    for(let i = 0; i < generateRandomInt(2, 6); i++) {
      offers.push({
        title: generateRandomWord(7 + generateRandomInt(-2, 6)),
        price: generateRandomInt(1, 15) * 10,
        id: nanoid(),
      });
    }
    TripPointRules.setOffersByTypeName(tripPointType.type, offers);
  }
})();

(() => {
  const cities = [
    'Washington',
    'New York',
    // 'Chicago',
    // 'Miami',
    // 'Oslo',
    // 'Milan',
    // 'Porto',
    // 'London',
  ];
  for(const city of cities) {
    CityRules.addCity({
      name: city,
      description: generateDescription(),
      pictures: generatePictures(),
    });
  }
})();

export const generateTripPointData = () => {
  const type = generatePointType().type;
  return {
    id: generatePointId(),
    type,
    destination: generateCity(),
    offers: generateOffers(type),
    base_price: generateRandomInt(1, 150) * 10,
    date_from: generateDate(5),
    date_to: generateDate(2),
    isFavorite: generateFavorite(),
  };
};
