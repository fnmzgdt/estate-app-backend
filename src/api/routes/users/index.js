const { getUsers, getUserById, registerUser, loginUser } = require("../../controllers/users");
const userRouter = require("express").Router();

userRouter.get("/users", getUsers);
userRouter.get("/user", getUserById);
userRouter.post("/user", registerUser)
userRouter.post("/login", loginUser)

module.exports = userRouter;
