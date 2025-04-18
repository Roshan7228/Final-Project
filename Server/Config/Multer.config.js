const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const Foldername = "./UpdateImage";
    let UserFoloder = `${Foldername}/User`
    if (!fs.existsSync(Foldername)) {
      fs.mkdirSync(Foldername);
      if (!fs.existsSync(UserFoloder)) {
        fs.mkdirSync(UserFoloder)
      }
    }
    cb(null, UserFoloder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})


const upload = multer({ storage: storage });

module.exports = upload