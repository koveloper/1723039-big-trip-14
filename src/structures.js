const createPointType = (title, isInMotion = true) => {
  return {
    title,
    type: title.toLowerCase(),
    isInMotion,
  };
};

export const TRIP_POINT_TYPES = [
  createPointType('Taxi'),
  createPointType('Bus'),
  createPointType('Train'),
  createPointType('Ship'),
  createPointType('Transport'),
  createPointType('Drive'),
  createPointType('Flight'),
  createPointType('Check-in', false),
  createPointType('Sightseeing', false),
  createPointType('Restaurant', false),
];


