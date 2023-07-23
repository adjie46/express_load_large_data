const express = require("express");

const route = express.Router();

const homeController = require("../controller/home.controller");

route.get("/", homeController.home_pages);
route.get("/data", homeController.get_data);

module.exports = route;
