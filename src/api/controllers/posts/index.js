const https = require("https");
const csv = require("csvtojson");
const fs = require("fs");
const fastcsv = require("fast-csv");
const utf8 = require("utf8");
const {
  createPost,
  getPosts,
  findPostsInRange,
  postRegion,
  getRegionFromPoint,
  postMunicipality,
  getMunicipalityFromPoint,
  postSettlement,
  getMunicipalityFromPointAndRegion,
  getSettlementFromPointAndMunicipality,
} = require("../../services/posts");
const {
  calculateLatitudesAndLongitudes,
} = require("../../utils/latitudeLongitudeCalculations");
const { sendResponse } = require("../../utils/sendResponse");

module.exports = {
  createPost: (req, res) => {
    const params = req.body;
    params.latitude = req.body.coordinates.split(",")[0];
    params.longitude = req.body.coordinates.split(",")[1];
    params.userId = req.user.id;
    sendResponse(req, res, createPost, params);
  },

  findPostsInRange: (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const distance = req.body.distance;

    const latsAndLongs = calculateLatitudesAndLongitudes(
      latitude,
      longitude,
      distance
    );

    sendResponse(req, res, findPostsInRange, latsAndLongs);
  },
  getPosts: (req, res) => {
    sendResponse(req, res, getPosts);
  },
  postRegions: (req, res) => {
    async function insertRegions(geoJson) {
      for (let i = 0; i < geoJson.features.length; i++) {
        let region = geoJson.features[i].geometry;
        region = JSON.stringify(region);
        await postRegion(geoJson.features[i].properties.nuts3, region);
      }
    }

    https.get(
      "https://raw.githubusercontent.com/yurukov/Bulgaria-geocoding/master/provinces.geojson",
      (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          let jsonData = JSON.parse(data);

          /*   for (let i = 0; i < jsonData.features.length; i++) {
            let region = jsonData.features[i].geometry;
            //,"crs":{"type":"name","properties":{"name":"EPSG:3857"}}
            region["crs"] = {
              type: "name",
              properties: { name: "EPSG:3857" },
            };
          }
          */

          //return res.status(200).json(jsonData.features[0].geometry);

          insertRegions(jsonData);
          return res.status(200).json({
            message: `succesfully inserted ${jsonData.features.length} entries`,
          });
        });
      }
    );
  },
  postMunicipalities: (req, res) => {
    async function insertMunicipalities(geoJson) {
      for (let i = 0; i < geoJson.features.length; i++) {
        let region = geoJson.features[i].geometry;
        const properties = geoJson.features[i].properties;

        let objectOrder = {
          type: null,
          coordinates: null,
        };

        region = Object.assign(objectOrder, region);
        region = JSON.stringify(region);
        console.log(region);

        await postMunicipality(
          properties.nuts4,
          properties.nuts3,
          properties.name,
          region
        );
      }
    }

    https.get(
      "https://raw.githubusercontent.com/yurukov/Bulgaria-geocoding/master/municipalities_names.geojson",
      (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          let jsonData = JSON.parse(data);

          try {
            insertMunicipalities(jsonData);
            return res.status(200).json({
              message: `succesfully inserted ${jsonData.features.length} entries`,
            });
          } catch (error) {
            return res.status(500).json({
              message: `${error}`,
            });
          }
        });
      }
    );
  },
  postSettlements: (req, res) => {
    csv()
      .fromFile("src/api/public/data.csv")
      .then((villagesJSON) => {
        async function insertSettlements(arrOfVillages) {
          for (let i = 0; i < arrOfVillages.length; i++) {
            await postSettlement(arrOfVillages[i]);
          }
        }

        https.get(
          "https://raw.githubusercontent.com/yurukov/Bulgaria-geocoding/master/settlements.geojson",
          (resp) => {
            let data = "";

            resp.on("data", (chunk) => {
              data += chunk;
            });

            resp.on("end", () => {
              let settlementsJSON = JSON.parse(data);
              const features = settlementsJSON.features;

              let merged = [];

              //forloop
              for (let i = 0; i < features.length; i++) {
                merged.push({
                  boundaries: features[i].geometry,
                  id: features[i].properties.ekatte,
                  municipalityId: features[i].properties.nuts4,
                  ...villagesJSON.find(
                    (village) =>
                      village.ekatte === features[i].properties.ekatte
                  ),
                  /*
                    id, 1
                    name, 1
                    postalCode, 1
                    village, 1
                    municipalityId, 1
                    boundaries,
                    center, 
                  */
                });
              }

              try {
                insertSettlements(merged);
                return res.status(200).json({
                  message: `succesfully inserted ${merged.length} entries`,
                });
              } catch (error) {
                return res.status(500).json({
                  message: `${error}`,
                });
              }
            });
          }
        );
      });
  },
  getRegionFromPoint: (req, res) => {
    const coordinates = req.body.coordinates;
    latitude = coordinates.split(",")[0];
    longitude = coordinates.split(",")[1];

    sendResponse(req, res, getRegionFromPoint, { latitude, longitude });
  },
  getMunicipalityFromPoint: (req, res) => {
    const coordinates = req.body.coordinates;
    latitude = coordinates.split(",")[0];
    longitude = coordinates.split(",")[1];

    sendResponse(req, res, getMunicipalityFromPoint, { latitude, longitude });
  },
  getSettlementFromPoint: (req, res) => {
    const coordinates = req.body.coordinates;
    latitude = coordinates.split(",")[0];
    longitude = coordinates.split(",")[1];

    /*
    const getRegion = getRegionFromPoint({ latitude, longitude });
    const getMunic = getMunicipalityFromPointAndRegion({
      latitude,
      longitude,
      regionId: code,
    });
    const getSettl = getSettlementFromPointAndMunicipality;

    Promise.all([getRegion, getMunic, getSettl]).then((result) => {
      return res.status(200).json(result);
    });
    */

    let response = {};

    getRegionFromPoint({ latitude, longitude }).then((result) => {
      response = { regionId: result[0].code, regionName: result[0].name };
      getMunicipalityFromPointAndRegion({
        regionId: result[0].code,
        latitude,
        longitude,
      }).then((result) => {
        response = {
          ...response,
          municipalityId: result[0].municipalityId,
          municipalityName: result[0].municipalityName,
        };
        getSettlementFromPointAndMunicipality({
          municipalityId: result[0].municipalityId,
          latitude,
          longitude,
        }).then((result) => {
          response = {
            ...response,
            settlementId: result[0].settlementId,
            settlementName: result[0].settlementName,
            postalCode: result[0].postalCode,
            village: result[0].village, //true for village, false for city
          };
          response.village = response.village ? "село" : "град";
          const location = `област ${response.regionName}, община ${response.municipalityName}, ${response.village} ${response.settlementName}`;
          return res.status(200).json(location);
        });
      });
    });
  },
};
