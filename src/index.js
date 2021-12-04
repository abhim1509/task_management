const express = require("express");
const { connection } = require("./utils/database");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = new express();
const port = process.env.PORT || 3000;

connection.bootstrapDB();

app.use(express.json());
app.use(userRouter); //Registering router
app.use(taskRouter); //Registering router

app.listen(port, () => {
  console.log(`Server is up @ port: ${port}`);
});
