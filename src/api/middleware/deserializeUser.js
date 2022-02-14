const { getSession } = require("../services/users");
const { verifyJWT, signJWT } = require("../utils/jwt");

const deserializeUser = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  //maybe wrong (if you have refresh token but no access token you are not authorized)
  if (!accessToken) {
    console.log("no access token");
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  //when it isn't expired (payload isn't nil) a.k.a. when the accessToken is still valid

  if (payload) {
    req.user = payload;
    return next();
  }

  //when the accessToken is expired but the refreshToken is valid

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  //the payload of verify(refreshToken) is a sessionId (the only claim it has)
  //if there is no payload from the refreshToken this is sus

  if (!refresh) {
    return next();
  }

  getSession(refresh.sessionId).then((result) => {
    if (result.length < 1) {
      //no such sessionId in the database so no authorization
      return next();
    }

    let session = result[0]
    session.password = undefined
    session = JSON.parse(JSON.stringify(session));

    const newAccessToken = signJWT(session, "2s");

    res.cookie("accessToken", newAccessToken, {
      maxAge: 1000 * 300,
      httpOnly: true,
    });

    req.user = verifyJWT(newAccessToken).payload;

    return next();
  });
};

module.exports = { deserializeUser };
