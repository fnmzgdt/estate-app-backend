const {
  getUsers,
  getUserById,
  registerUser,
  getUserByEmail,
  createSession,
} = require("../../services/users");
const { sendResponse, sendAuthResponse } = require("../../utils/sendResponse");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { signJWT, verifyJWT } = require("../../utils/jwt");

module.exports = {
  getMyInfo: (req, res) => {
    return res.send(req.user);
  },
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
          let claims = results[0];
          claims.password = undefined;
          claims = JSON.parse(JSON.stringify(claims));

          const sessionId = Math.floor(Date.now() / 1000);

          createSession({ sessionId, ...claims });

          const accessToken = signJWT({ sessionId, ...claims }, "5m");

          const refreshToken = signJWT({ sessionId }, "1y");

          res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 14,
            httpOnly: true,
          });

          res.cookie("refreshToken", refreshToken, {
            maxAge: 3.154e10,
            httpOnly: true,
          });

          return res.status(200).json({
            success: 1,
            session: 1,
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
  logoutUser: (req, res) => {
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    //delete session

    return res.status(200).json({ message: "Succesfully logged out" });
  },
};
