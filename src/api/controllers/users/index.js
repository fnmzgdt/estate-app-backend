const {
  getUsers,
  getUserById,
  registerUser,
  getUserByEmail,
} = require("../../services/users");
const { sendResponse, sendAuthResponse } = require("../../utils/sendResponse");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

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
  registerUser: (req, res) => {
    const params = req.body;

    const salt = genSaltSync(10);
    params.password = hashSync(params.password, salt);
    params.createdAt = new Date();

    sendAuthResponse(req, res, registerUser, params, sign);
  },
  loginUser: (req, res) => {
    let params = req.body;

    getUserByEmail(params)
      .then((results) => {
        if (results.length == 0) {
          return res
            .status(400)
            .json({ success: 0, message: "Wrong email or password." });
        }

        const result = compareSync(params.password, results[0].password);

        if (result) {
          params.password = undefined;
          params = JSON.parse(JSON.stringify(params));

          const jwt = sign(params, "hashkey", { expiresIn: "16h" });

          res.cookie("access-token", jwt, { maxAge: 3600 * 1000 });
          return res.status(200).json({
            success: 1,
            results,
            message: "Successful Authentication!",
          });
        } else {
          return res.status(400).json({ message: "Wrong email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ success: 0, err });
      });
  },
};
