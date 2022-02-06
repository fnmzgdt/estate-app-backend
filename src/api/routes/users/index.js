const { getUsers, getUserById } = require("../../controllers/users");
const userRouter = require("express").Router();

userRouter.get("/users", getUsers);
userRouter.get("/user", getUserById);

module.exports = userRouter;
