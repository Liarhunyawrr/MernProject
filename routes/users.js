const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pintrest");

const schemaData = new mongoose.Schema({
  username: String,
  fullname: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  dp: String,
  email: String,
  password: String,
});
schemaData.plugin(plm);
module.exports = mongoose.model("Data", schemaData);
