const {
  getMyInfo,
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  logoutUser,
  insertSession,
} = require("../../controllers/users");
const requireAuthentication = require("../../middleware/requireAuthentication");
const userRouter = require("express").Router();

userRouter.post("/demo", insertSession);
userRouter.get("/me", requireAuthentication, getMyInfo);
userRouter.get("/users", requireAuthentication, getUsers);
userRouter.get("/user", getUserById);
userRouter.post("/user", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/logout", logoutUser);

module.exports = userRouter;
