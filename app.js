const express = require("express");
const app = express();
require("dotenv").config();
const userRouter = require("./src/api/routes/users");

app.use(express.json());
app.use("/api", userRouter);

app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on PORT ${process.env.APP_PORT}`);
});