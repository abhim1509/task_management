const express = require("express");
const { connection } = require("./utils/database");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const authRouter = require("./routers/authentication");
var cors = require("cors");

const app = new express();
const port = 4000;

connection.bootstrapDB();

app.use(express.json());
app.use(cors());
app.use(userRouter); //Registering router
app.use(taskRouter); //Registering router
app.use(authRouter); //Registering router

app.listen(port, () => {
  console.log(`Server is up @ port: ${port}`);
});
