const { createPost } = require("../../services/posts");
const { sendResponse } = require("../../utils/sendResponse");

module.exports = {
  createPost: (req, res) => {
    const params = req.body;
    params.userId = req.user.id;
    sendResponse(req, res, createPost, params);
  },
  findPostsInRange: (req, res) => {
    const calculateLatitudes = (latitude, distance) => {
      if (distance > 2000) {
        return "distance can't exeed 2km";
      }
      const R = 6371e3; // metres
      const lat = (latitude * Math.PI) / 180;
      const dlat = distance / R;
      const x = lat + dlat;
      const y = lat - dlat;
      return [(x * 180) / Math.PI, (y * 180) / Math.PI];
    };
    //LATITUDES MUST BE BETWEEN -90 AND 90 DEG. ADD CHECKERS

    const calculateLongitudes = (latitude, longitude, distance) => {
      if (distance > 2000) {
        return "distance can't exeed 2km";
      }
      const R = 6371e3; // metres
      const long = (longitude * Math.PI) / 180;
      const lat = (latitude * Math.PI) / 180;

      const formula = Math.sin(distance / (2 * R)) / Math.cos(lat);

      if (formula > 1) {
        return "move away from the poles";
      }

      const dlong = 2 * Math.asin(formula);

      const x = long - dlong;
      const y = long + dlong;

      return [(x * 180) / Math.PI, (y * 180) / Math.PI];
    };
    //LONGITUDES MUST BE BETWEEN -180 AND 180 DEG. ADD CHECKERS

    const pairOfLatitudes = calculateLatitudes(
      req.body.latitude,
      req.body.distance
    );

    const pairOfLongitudes = calculateLongitudes(
      req.body.latitude,
      req.body.longitude,
      req.body.distance
    );

    return res.status(200).json({ pairOfLatitudes, pairOfLongitudes });
  },
};
