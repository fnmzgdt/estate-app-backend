const pool = require("../../../config/mysqldb");
const MySQLquery = require("../../utils/query");

module.exports = {
  createPost: ({
    userId,
    title,
    description,
    latitude,
    longitude,
    price,
    currency,
  }) => {
    const query =
      "INSERT INTO posts(user_id, title, description, price, currency, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return MySQLquery(pool, query, [
      userId,
      title,
      description,
      price,
      currency,
      latitude,
      longitude,
    ]);
  },
  getPosts: () => {
    const query = "SELECT * FROM posts ORDER BY id DESC LIMIT 20";
    return MySQLquery(pool, query, []);
  },
  findPostsInRange: ({ latLow, latUp, longLow, longUp }) => {
    const query =
      "SELECT * FROM posts WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?";
    return MySQLquery(pool, query, [latLow, latUp, longLow, longUp]);
  },
  postRegion: (code, geoJson) => {
    const query =
      "INSERT INTO regions(code, boundaries) VALUES (?, ST_GeomFromGeoJSON(?))";
    return MySQLquery(pool, query, [code, geoJson]);
  },
  postMunicipality: (id, regionId, name, boundaries) => {
    const query = `INSERT INTO municipalities(id, region_id, name, boundaries) VALUES (?, ?, ?, ST_GeomFromGeoJSON('${boundaries}'))`;
    return MySQLquery(pool, query, [id, regionId, name]);
  },
  postSettlement: ({
    id,
    name,
    postalCode,
    village,
    municipalityId,
    boundaries,
    center,
  }) => {
    let point;
    if (!center) {
      point = `POINT(0.0000 90.0000)`;
    } else {
      const longitude = center.split(",")[0];
      const latitude = center.split(",")[1];
      point = `POINT(${longitude} ${latitude})`;
    }

    console.log(boundaries);

    const query = `INSERT INTO settlements(id, name, postal_code, village, municipality_id, boundaries, center) VALUES (?, ?, ?, ?, ?, ST_GeomFromGeoJSON(?), GeomFromText(?))`;

    return MySQLquery(pool, query, [
      id,
      name,
      postalCode,
      village,
      municipalityId,
      JSON.stringify(boundaries),
      point,
    ]);
  },
  getRegionFromPoint: ({ latitude, longitude }) => {
    const point = `POINT(${longitude} ${latitude})`;
    const query =
      "SELECT name, code FROM regions WHERE ST_Contains(regions.boundaries, GeomFromText(?));";
    return MySQLquery(pool, query, [point]);
  },
  getMunicipalityFromPoint: ({ latitude, longitude }) => {
    const point = `POINT(${longitude} ${latitude})`;
    const query =
      "SELECT id, region_id, name FROM municipalities WHERE ST_Contains(municipalities.boundaries, GeomFromText(?));";
    return MySQLquery(pool, query, [point]);
  },
  getMunicipalityFromPointAndRegion: ({ regionId, latitude, longitude }) => {
    const point = `POINT(${longitude} ${latitude})`;
    const query =
      "SELECT id as municipalityId, name as municipalityName FROM municipalities WHERE region_id = ? AND ST_Contains(municipalities.boundaries, GeomFromText(?));";
    return MySQLquery(pool, query, [regionId, point]);
  },
  getSettlementFromPointAndMunicipality: ({
    municipalityId,
    latitude,
    longitude,
  }) => {
    const point = `POINT(${longitude} ${latitude})`;
    const query =
      "SELECT id as settlementId, name as settlementName, postal_code as postalCode, village FROM settlements WHERE municipality_id = ? AND ST_Contains(settlements.boundaries, GeomFromText(?));";
    return MySQLquery(pool, query, [municipalityId, point]);
  },
};
