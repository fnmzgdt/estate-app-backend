const {
  createPost,
  findPostsInRange,
  getPosts,
  postRegions,
  getRegionFromPoint,
  postMunicipalities,
  getMunicipalityFromPoint,
  postSettlements,
  getSettlementFromPoint,
} = require("../../controllers/posts");
const requireAuthentication = require("../../middleware/requireAuthentication");

const postRouter = require("express").Router();

postRouter.post("/article", requireAuthentication, createPost);
postRouter.get("/latlong", findPostsInRange);
postRouter.get("/posts", getPosts);
postRouter.post("/regions", postRegions);
postRouter.post("/municipalities", postMunicipalities);
postRouter.get("/region", getRegionFromPoint);
postRouter.post("/settlements", postSettlements);
postRouter.get("/municipality", getMunicipalityFromPoint);
postRouter.get("/settlement", getSettlementFromPoint);

module.exports = postRouter;
