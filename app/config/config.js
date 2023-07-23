require("dotenv").config();

module.exports = {
	baseUrl: process.env.BASE_URL,
	hex: process.env.HEX,
	port: process.env.PORT,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpireWeb: process.env.JWT_EXPIRE,
	jwtExpireMobile: process.env.JWT_EXPIRE_MOBILE,
	jwtExpireReset: process.env.JWT_EXPIRE_RESET,
	mode: process.env.MODE,
	whitelist: process.env.WHITELIST,
	limitBody: process.env.LIMIT_BODY,
	nameSpace: process.env.MY_NAMESPACE,
	userAgent: process.env.USER_AGENT,
};
