const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/google-mercado', (req, res) => res.send(req.user))

// Ruta de callback de Google después de la autenticación
router.get('/callback-mercado', (req, res) => {
  const secretKey = process.env.TOKEN_KEY
  const clientId = req.user.id
  const displayName = req.user.displayName
  const clientName = req.user.name.givenName
  const clientLastName = req.user.name.familyName
  const clientEmail = req.user.emails[0].value
  const profilePic = req.user.photos[0].value
  // // Crear un token JWT para el usuario
  const token = jwt.sign(
    {
      displayName,
      clientId,
      clientName,
      clientLastName,
      clientEmail,
      profilePic,
    },
    secretKey,
    {
      expiresIn: '2h',
    },
  )

  // Obtén la URL del frontend desde la variable de entorno
  const frontendURL = process.env.FRONTEND_URL_MERCADO

  // Redirige al frontend incluyendo el token como parámetro en la URL
  res.redirect(`${frontendURL}?token=${token}`)
})

module.exports = router
