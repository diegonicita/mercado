const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.get(
  '/google-examenes',
  passport.authenticate('examenes', {
    scope: ['profile', 'email'],
    session: false,
  }),
)
router.get(
  '/google-mercado',
  passport.authenticate('mercado', {
    scope: ['profile', 'email'],
    session: false,
  }),
)

// Ruta de callback de Google después de la autenticación
router.get('/callback-mercado', (req, res) => {
  const secretKey = process.env.TOKEN_KEY
  const clientId = req.client.clientId
  // // Crear un token JWT para el usuario
  const token = jwt.sign({ clientId }, secretKey, {
    expiresIn: '2h',
  })

  // Obtén la URL del frontend desde la variable de entorno
  const frontendURL = process.env.FRONTEND_URL_MERCADO

  // Redirige al frontend incluyendo el token como parámetro en la URL
  res.redirect(`${frontendURL}?token=${token}`)
})

// Ruta de callback de Google después de la autenticación
router.get('/callback-examenes', (req, res) => {
  const secretKey = process.env.TOKEN_KEY
  const clientId = req.client.clientId
  // // Crear un token JWT para el usuario
  const token = jwt.sign({ clientId }, secretKey, {
    expiresIn: '2h',
  })

  // Obtén la URL del frontend desde la variable de entorno
  const frontendURL = process.env.FRONTEND_URL_EXAMENES_REDIRECT

  // Redirige al frontend incluyendo el token como parámetro en la URL
  res.redirect(`${frontendURL}?token=${token}`)
})

module.exports = router
