const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController.js");

router.get("/", apiController.index);
router.get("/clasificaciones", apiController.clasificaciones);
router.get("/preguntas/:id", apiController.preguntas);

module.exports = router;