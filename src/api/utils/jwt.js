const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();
const { privateKey } = JSON.parse(process.env.PRIVATE_KEY);
const { publicKey } = JSON.parse(process.env.PUBLIC_KEY);

function signJWT(payload, expiresIn) {
  return sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });
}

function verifyJWT(token) {
  try {
    const decoded = verify(token, publicKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: true };
  }
}

module.exports = { signJWT, verifyJWT };
