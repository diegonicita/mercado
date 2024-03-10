const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/google', (req, res) => res.send(req.user))

// Ruta de callback de Google después de la autenticación
router.get('/callback', async (req, res) => {
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
  res.cookie('token', token, {
    maxAge: 900000,
    httpOnly: true,
    domain: '.webapp.ar',
  })
  res.redirect(`https://webapp.ar`)
})

module.exports = router
