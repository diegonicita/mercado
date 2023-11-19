const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.get(
  '/google',
  passport.authenticate('examenes', {
    scope: ['profile', 'email'],
    session: false,
  }),
  (req, res) => res.json(req.user),
)

// Ruta de callback de Google después de la autenticación
router.get('/callback', (req, res) => {
  const secretKey = process.env.TOKEN_KEY
  const clientId = req.client.clientId
  // // Crear un token JWT para el usuario
  const token = jwt.sign({ clientId }, secretKey, {
    expiresIn: '2h',
  })

  // Obtén la URL del frontend desde la variable de entorno
  const frontendURL = 'http://localhost:8126'

  // Redirige al frontend incluyendo el token como parámetro en la URL
  res.redirect(`${frontendURL}?token=${token}`)
})

module.exports = router
