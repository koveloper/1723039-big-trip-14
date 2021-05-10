const cityList = [];

const getCityList = () => cityList;

const addCity = ({ name, description = '', pictures = [] } = {}) => {
  if (name) {
    const c = cityList.find((v) => v.name === name);
    if (c) {
      cityList[cityList.indexOf(c)] = { name, description, pictures };
    } else {
      cityList.push({ name, description, pictures });
    }
  }
};

const getCity = (name) => cityList.find((city) => city.name === name);

const getCityByIndex = (i) => cityList[i];

const getCityPictures = (name) => {
  const {
    pictures = [],
  } = getCity(name);
  return pictures;
};

const getCityDescription = (name) => {
  const {
    description = [],
  } = getCity(name);
  return description;
};

const Cities = {
  getCityList,
  addCity,
  getCity,
  getCityByIndex,
  getCityPictures,
  getCityDescription,
};

export default Cities;
