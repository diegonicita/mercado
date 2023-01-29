const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersController.js')

router.get('/login', controller.login)
router.get('/register', controller.register)

module.exports = router
