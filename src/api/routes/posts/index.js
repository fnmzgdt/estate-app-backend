const { createPost, findPostsInRange } = require("../../controllers/posts");
const requireAuthentication = require("../../middleware/requireAuthentication");

const postRouter = require("express").Router();

postRouter.post("/article", requireAuthentication, createPost);
postRouter.get("/longlat", findPostsInRange);

module.exports = postRouter;
