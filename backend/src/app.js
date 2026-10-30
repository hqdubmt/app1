const express = require("express");

const userRouter = require("./routers/user.router");
const proRouter = require("./routers/pro.router");
const { deleteUser } = require("./models/user.model");

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/products", proRouter);





module.exports = app;
