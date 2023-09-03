const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController.js");

router.get("/", apiController.index);
router.get("/clasificaciones", apiController.clasificaciones);

module.exports = router;