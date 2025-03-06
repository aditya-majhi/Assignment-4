const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log({ cb1: cb });
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    console.log({ cb2: cb });
    const uniqueString = `${file.originalname}-${Date.now()}`;

    cb(null, uniqueString);
  },
});

const upload = multer({ storage });

module.exports = upload;
