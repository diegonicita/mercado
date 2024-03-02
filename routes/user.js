const express = require('express')
const router = express.Router()
const {
  login,
  list,
  register,
  profile,
  sendEmail,
  sendCode,
} = require('../controllers/usersController.js')
const verifyToken = require('../middlewares/verifyToken')
const { body } = require('express-validator')

// Validaciones login
const loginValidations = [
  body('email').notEmpty().withMessage('Debes completar el campo'),
  body('password').notEmpty().withMessage('Debes completar el campo'),
]

const registerValidations = [
  body('password').notEmpty().withMessage('Debes completar el campo'),
  body('email').notEmpty().isEmail().withMessage('Email invalido'),
]

router.post('/login', loginValidations, login)
router.post('/register', registerValidations, register)
router.get('/profile/:id', verifyToken, profile)
router.get('/list', verifyToken, list)
router.post('/sendEmail', verifyToken, sendEmail)
router.post('/sendCode', verifyToken, sendCode)

module.exports = router
