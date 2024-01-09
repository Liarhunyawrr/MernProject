const mongoose = require("mongoose");

const postdata = new mongoose.Schema({
  image: String,
  posttext: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Data",
  },
});

postdata.pre("save", function (next) {
  if (!this.posttext) {
    const error = new Error("Post text is required.");
    return next(error);
  }
  next();
});

module.exports = mongoose.model("post", postdata);
