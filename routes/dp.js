const multer = require("multer");
const { v4: uuidvr } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/dp");
  },
  filename: function (req, file, cb) {
    const uniquename = uuidvr();
    cb(null, uniquename + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
