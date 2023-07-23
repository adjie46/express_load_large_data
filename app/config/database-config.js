require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USER_DEV,
		password: process.env.DB_PASSWORD_DEV,
		database: process.env.DB_NAME_DEV,
		host: process.env.DB_HOST_DEV,
		dialect: process.env.DB_DIALECT_DEV,
		port: process.env.DB_PORT_CUSTOM,
		dialectOptions: {
			timezone: "+07:00",
		},
		logging: false,
		timezone: "+07:00",
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "mysql",
		logging: false,
		port: process.env.DB_PORT_CUSTOM,
	},
	production: {
		username: process.env.DB_USER_PROD,
		password: process.env.DB_PASSWORD_PROD,
		database: process.env.DB_NAME_PROD,
		host: process.env.DB_HOST_PROD,
		dialect: process.env.DB_DIALECT_PROD,
		logging: false,
		port: process.env.DB_PORT_CUSTOM,
		dialectOptions: {
			timezone: "+07:00",
		},
		timezone: "+07:00",
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
};
