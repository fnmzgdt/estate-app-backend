const express = require("express");
const cookies = require("cookie-parser");

const { deserializeUser } = require("./src/api/middleware/deserializeUser");
const app = express();
require("dotenv").config();
const userRouter = require("./src/api/routes/users");
const postRouter = require("./src/api/routes/posts")

app.use(express.json());
app.use(cookies())
app.use(deserializeUser);
app.use("/api", userRouter);
app.use("/api", postRouter)

app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on PORT ${process.env.APP_PORT}`);
});
