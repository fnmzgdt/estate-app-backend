const { getSession } = require("../services/users");
const { verifyJWT, signJWT } = require("../utils/jwt");

const deserializeUser = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  //when it isn't expired

  if (payload) {
    req.user = payload;
    return next();
  }

  //expired access token but there is still a refreshToken

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  //the payload of verify(refreshToken) is a sessionId
  //if there is no payload

  if (!refresh) {
    return next();
  }

  getSession(refresh.sessionId).then((result) => {
    if (result.length < 1) {
      return next();
    }
    const session = {};
    session.sessionId = result[0].id;
    session.id = result[0].user_id;
    session.first_name = result[0].first_name;
    session.last_name = result[0].last_name;
    session.email = result[0].email;

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
