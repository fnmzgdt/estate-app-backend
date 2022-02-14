const { createPost } = require("../../services/posts");
const { sendResponse } = require("../../utils/sendResponse");

module.exports = {
  createPost: (req, res) => {
    const params = req.body;
    params.userId = req.user.id;
    sendResponse(req, res, createPost, params);
  },
};
