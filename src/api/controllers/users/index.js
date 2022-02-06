const { getUsers, getUserById } = require("../../services/users");
const sendResponse = require("../../utils/sendResponse");

module.exports = {
  getUsers: (req, res) => {
    sendResponse(req, res, getUsers);
  },
  getUserById: (req, res) => {
    const params = {
      id: req.query.id,
    };
    sendResponse(req, res, getUserById, params);
  },
};
