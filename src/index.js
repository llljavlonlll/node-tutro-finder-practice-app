const express = require("express");
const userRouter = require("./routers/user");
const profileRouter = require("./routers/profile");
require("./db/mongoose");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(profileRouter);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
