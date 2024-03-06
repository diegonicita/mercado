const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/google-examenes', (req, res) => res.send(req.user))

// Ruta de callback de Google después de la autenticación
router.get('/callback-examenes', (req, res) => {
  const secretKey = process.env.TOKEN_KEY
  const clientId = req.user.id
  const displayName = req.user.displayName
  const clientName = req.user.name.givenName
  const clientLastName = req.user.name.familyName
  const clientEmail = req.user.emails[0].value
  const profilePic = req.user.photos[0].value
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
  // Establecer la cookie en la respuesta
  res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
  // Obtén la URL del frontend desde la variable de entorno
  const frontendURL = process.env.FRONTEND_URL_EXAMENES_REDIRECT
  // Redirige al frontend incluyendo el token como parámetro en la URL
  res.redirect(`${frontendURL}`)
})

module.exports = router
