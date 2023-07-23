//IMPORT LIBRARY
const config = require("../config/config");
const messages = require("./message_response");

const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");

const hbs = require("hbs");
const hbsutils = require("hbs-utils")(hbs);
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

var csrf = require("csurf");
const sharp = require("sharp");

const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const fs = require("fs");
const jose = require("jose");

const { v5: uuidv5 } = require("uuid");
const model = require("../database/models/index");
const responseStatus = require("./response_status");
const { Op, Sequelize } = require("sequelize");
const axios = require("axios");
const formData = require("./form_data");
const expressip = require("express-ip");
var device = require("express-device");
const moment = require("moment");

async function resizeImage(path, filename, type) {
	return new Promise(async (resolve, reject) => {
		try {
			await sharp(path)
				.toFormat("jpeg", {
					quality: 10,
				})
				.toFile(`public/upload/${type}/small/${filename}`);

			await sharp(path)
				.toFormat("jpeg", {
					quality: 50,
				})
				.toFile(`public/upload/${type}/medium/${filename}`);

			await sharp(path)
				.toFormat("jpeg", {
					quality: 100,
					chromaSubsampling: "4:4:4",
				})
				.toFile(`public/upload/${type}/original/${filename}`);
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
}

const getPagination = (page, size) => {
	const limit = size ? +size : 10;
	const offset = page ? page * limit : 0;

	return { limit, offset };
};

async function prayer_time() {
	return new Promise(async (resolve, reject) => {
		const today = new Date();
		const month = today.getMonth() + 1;
		const years = today.getFullYear();
		try {
			let config = {
				method: "get",
				maxBodyLength: Infinity,
				url: `https://muslimummah.co/api-server/prayer/monthly-time/v1?location=Kabupaten Aceh Tamiang&month[]=${years}-${month}`,
				headers: {},
			};

			axios
				.request(config)
				.then((response) => {
					resolve(
						JSON.stringify(
							response.data.data.prayer_time_monthly[0].prayer_day_list
						)
					);
				})
				.catch((error) => {
					reject(error);
				});
		} catch (error) {
			reject(error);
		}
	});
}

function currentDate(date) {
	date = new Date();

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

async function getStatusTTE(nik) {
	return new Promise(async (resolve, reject) => {
		try {
			promise = await Promise.all([
				apiBsre(nik, "user/status/"),
				apiBsre(nik, "user/profile/"),
			])
				.then((data) => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				});
		} catch (error) {
			reject(error);
		}
	});
}

async function apiBsre(nik, action) {
	return new Promise(async (resolve, reject) => {
		try {
			var username, password, urlTte;

			urlTte = config.baseUrlApiSignProd;
			username = config.usernameSign_prod;
			password = config.passwordSign_prod;

			var configs = {
				method: "get",
				url: urlTte + action + nik,
				auth: {
					username: username,
					password: password,
				},
				responseType: "json",
			};

			axios(configs)
				.then(async function (response) {
					resolve(response.data);
				})
				.catch(function (error) {
					reject(error);
				});
		} catch (error) {
			reject(error);
		}
	});
}

//Encrypting text
async function encrypt(text) {
	return new Promise(async (resolve, reject) => {
		try {
			let iv = crypto.randomBytes(16);
			let salt = crypto.randomBytes(16);
			let key = crypto.scryptSync(config.jwtSecret, salt, 32);

			let cipher = crypto.createCipheriv(algorithm, key, iv);
			let encrypted = cipher.update(text, "utf8", "hex");
			encrypted += cipher.final("hex");
			resolve(`${iv.toString("hex")}:${salt.toString("hex")}:${encrypted}`);
		} catch (error) {
			reject(error);
		}
	});
}

const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

// Decrypting text
async function decrypt(text) {
	return new Promise(async (resolve, reject) => {
		try {
			let [ivs, salts, data] = text.split(":");
			let iv = Buffer.from(ivs, "hex");
			let salt = Buffer.from(salts, "hex");
			let key = crypto.scryptSync(config.jwtSecret, salt, 32);

			let decipher = crypto.createDecipheriv(algorithm, key, iv);
			let decrypted = decipher.update(data, "hex", "utf8");
			decrypted += decipher.final("utf8");
			resolve(decrypted.toString());
		} catch (error) {
			reject(error);
		}
	});
}

const encryptedJwt = (subject, payload, secret, expired) => {
	return new jose.EncryptJWT(payload)
		.setProtectedHeader({
			alg: "dir",
			enc: "A256GCM",
		})
		.setIssuedAt()
		.setSubject(subject)
		.setIssuer(config.baseUrl)
		.setAudience(config.baseUrl)
		.setExpirationTime(expired)
		.encrypt(secret);
};

const decryptJwt = async (jwt, secret) => {
	const options = {
		issuer: config.baseUrl,
		audience: config.baseUrl,
		contentEncryptionAlgorithms: ["A256GCM"],
		keyManagementAlgorithms: ["dir"],
	};
	return jose.jwtDecrypt(jwt, secret, options);
};

const logs = async (data) => {
	newLogs = {
		id_auth: data.id_auth,
		log_type: data.log_type,
		log_action: data.log_action,
		log_os: data.log_os,
		log_devices: data.log_devices,
		log_ip: data.log_ip,
	};

	await model.log.create(newLogs);
};

const uuid = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			uuidGen = uuidv5(await randomString(10), config.nameSpace);
			resolve(uuidGen);
		} catch (error) {
			reject(error);
		}
	});
};

//Random String
async function randomString(length) {
	return new Promise(async (resolve, reject) => {
		try {
			var result = "";
			var characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var charactersLength = characters.length;
			for (var i = 0; i < length; i++) {
				result += characters.charAt(
					Math.floor(Math.random() * charactersLength)
				);
			}
			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
}

function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) return false;
	}
	return true;
}

function truncate(str, n) {
	if (str.length > n) {
		return str.substring(0, n) + "******";
	} else {
		return str;
	}
}

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function convertMsToTime(milliseconds) {
	let seconds = Math.floor(milliseconds / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);

	seconds = seconds % 60;
	minutes = minutes % 60;

	// 👇️ If you don't want to roll hours over, e.g. 24 to 00
	// 👇️ comment (or remove) the line below
	// commenting next line gets you `24:00:00` instead of `00:00:00`
	// or `36:15:31` instead of `12:15:31`, etc.
	hours = hours % 24;

	return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
		seconds
	)}`;
}

function toRupiah(angka, prefix) {
	let angka1 = angka.toString();
	let number_string = angka1.replace(/[^,\d]/g, "").toString();
	var split = number_string.split(",");
	var sisa = split[0].length % 3;
	var rupiah = split[0].substr(0, sisa);
	var ribuan = split[0].substr(sisa).match(/\d{3}/gi);

	if (ribuan) {
		separator = sisa ? "." : "";
		rupiah += separator + ribuan.join(".");
	}

	rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
	return prefix == undefined ? rupiah : rupiah ? "Rp " + rupiah : "";
}

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: datas } = data;
	const currentPage = page ? +page : 0;
	const totalPages = Math.ceil(totalItems / limit);

	return { totalItems, datas, totalPages, currentPage };
};

module.exports = {
	config,
	express,
	cors,
	http,
	bodyParser,
	hbs,
	hbsutils,
	session,
	cookieParser,
	path,
	csrf,
	messages,
	resizeImage,
	encrypt,
	decrypt,
	encryptedJwt,
	decryptJwt,
	randomString,
	isEmpty,
	toRupiah,
	waitFor,
	asyncForEach,
	uuid,
	model,
	responseStatus,
	Op,
	axios,
	formData,
	logs,
	expressip,
	device,
	fs,
	prayer_time,
	currentDate,
	getPagination,
	getPagingData,
	truncate,
	getStatusTTE,
	apiBsre,
	sharp,
	convertMsToTime,
	moment,
	Sequelize,
};
