const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
})

const upload = multer({ storage: storage });

module.exports = upload;