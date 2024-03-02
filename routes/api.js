const express = require('express')
const router = express.Router()
const apiController = require('../controllers/apiController.js')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', apiController.index)
router.get('/clasificaciones', apiController.clasificaciones)
router.get('/preguntas/:id', apiController.preguntas)
router.get('/examen', apiController.examenes)
router.get('/examenes', apiController.examenesDisponibles)
router.get('/login/:email/code', verifyToken, apiController.emailCode)

module.exports = router
