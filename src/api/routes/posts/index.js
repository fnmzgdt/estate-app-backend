const { createPost } = require("../../controllers/posts");
const requireAuthentication = require("../../middleware/requireAuthentication");

const postRouter = require("express").Router();

postRouter.post("/article", requireAuthentication, createPost);

module.exports = postRouter;
