const util = require("util");
const multer = require("multer");
const maxSize = 1 * 1024 * 1024;

const { v4: uuidv4 } = require("uuid");

const config = require("../config/config");
const path = require("path");

const whitelist = ["image/png", "image/jpeg", "image/jpg"];

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file) {
			cb(null, "./public/upload/temp");
		} else {
			console.log("TIDAK ADA");
		}
	},
	filename: function (req, file, cb) {
		cb(null, `${uuidv4()}` + path.extname(file.originalname));
	},
});

var uploadFile = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (!whitelist.includes(file.mimetype)) {
			return cb(new Error(message.notAllowed));
		}
		cb(null, true);
	},
	limits: {
		fileSize: maxSize,
	},
}).any();

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
