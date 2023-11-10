const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { User } = require('../database/models')
const jwt = require('jsonwebtoken')

const controller = {
  login: async (req, res) => {
    const errors = validationResult(req)
    const emailFromBody = req.body?.email?.trim()
    if (errors.isEmpty()) {
      await User.findOne({
        where: { email: emailFromBody },
        attributes: ['id', 'username', 'password', 'email'],
      })
        .then((userFound) => {
          if (
            userFound != null &&
            bcrypt.compareSync(req.body.password, userFound.dataValues.password)
          ) {
            // Create token
            var token = jwt.sign(
              { email: emailFromBody },
              process.env.TOKEN_KEY,
              {
                expiresIn: '2h',
              },
            )
            res.status(200).send({
              error: false,
              message: 'Login exitoso',
              userResponse: { email: userFound.email },
              token,
            })
          } else {
            res.status(401).send({
              error: true,
              message: 'Las credenciales son incorrectos',
              userResponse: {},
              token: null,
            })
          }
        })
        .catch((error) => res.send(error))
    } else {
      res.json(errors)
    }
  },
  register: (req, res) => {
    res.render('register')
  },
  list: (req, res) => {
    res.render('list')
  },
}

module.exports = controller
