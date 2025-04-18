const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const Foldername = "./UploadImage";
    const UserFolder = `${Foldername}/User`;
    const BlogFolder = `${Foldername}/Blog`;

    if (!fs.existsSync(Foldername)) {
      fs.mkdirSync(Foldername);
    }
    if (file.fieldname === "ProfilePictures") {
      if (!fs.existsSync(UserFolder)) {
        fs.mkdirSync(UserFolder);
      }
      cb(null, UserFolder);
    } else {
      if (!fs.existsSync(BlogFolder)) {
        fs.mkdirSync(BlogFolder);
      }
      cb(null, BlogFolder);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
