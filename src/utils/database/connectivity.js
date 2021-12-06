const mongoose = require("mongoose");

const DB_URL = "mongodb://127.0.0.1:27017/task-manager";

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${DB_URL}`);
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected.");
});

module.exports.bootstrapDB = () => {
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};
