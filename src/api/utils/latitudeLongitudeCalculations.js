module.exports = {
  calculateLatitudesAndLongitudes: (latitude, longitude, distance) => {
    if (distance > 9000) {
      return { message: "distance can't exeed 9km" };
    }
    const R = 6371e3; // metres
    const long = (longitude * Math.PI) / 180;
    const lat = (latitude * Math.PI) / 180;
    const dlat = distance / R;

    let latUp = lat + dlat;
    latUp = (latUp * 180) / Math.PI;

    let latLow = lat - dlat;
    latLow = (latLow * 180) / Math.PI;

    if (latUp > 90 || latLow < -90) {
      return { message: "move away from the poles" };
    }

    ///////////////////////////////  LONGITUDES CALCULATIONS  ///////////////////////////////

    const formula = Math.sin(distance / (2 * R)) / Math.cos(lat);

    if (formula > 1) {
      return { message: "move away from the poles" };
    }

    const dlong = 2 * Math.asin(formula);

    let longUp = long + dlong;
    let longLow = long - dlong;

    longUp = (longUp * 180) / Math.PI;
    longLow = (longLow * 180) / Math.PI;

    if (longUp > 180 || longLow < -180) {
      return { message: "move away from the prime meridian" };
    }

    return { latLow, latUp, longLow, longUp };
    // return { latUp, latLow };
  },
};
//LATITUDES MUST BE BETWEEN -90 AND 90 DEG. ADD CHECKERS
//LONGITUDES MUST BE BETWEEN -180 AND 180 DEG. ADD CHECKERS
