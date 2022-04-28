const mongoose = require("mongoose");
require("dotenv").config();

const client = () => {
  mongoose
    .connect(process.env.DB_PATH)
    .then((res) => console.log("Connected to DB..."))
    .catch((err) => console.log(err));
};

module.exports = client;
