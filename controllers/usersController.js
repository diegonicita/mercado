const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { User } = require('../database/models')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const errors = validationResult(req)
  console.log(errors)
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
}

const list = (req, res) => {
  res.render('list')
}

const register = async (req, res) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    const { username, email, password } = req.body

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({
      where: { email: email.trim() },
      attributes: ['id'],
    })

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'El usuario con este correo electrónico ya existe',
        userResponse: {},
        token: null,
      })
    }

    // If the user doesn't exist, hash the password and create a new user
    const hashedPassword = bcrypt.hashSync(password, 10)

    try {
      const newUser = await User.create({
        username,
        email: email.trim(),
        password: hashedPassword,
      })

      // Create token for the new user
      const token = jwt.sign({ email: newUser.email }, process.env.TOKEN_KEY, {
        expiresIn: '2h',
      })

      res.status(201).json({
        error: false,
        message: 'Registro exitoso',
        userResponse: { email: newUser.email },
        token,
      })
    } catch (error) {
      res.status(500).json({
        error: true,
        message: 'Error al registrar el usuario',
        userResponse: {},
        token: null,
      })
    }
  } else {
    res.status(400).json(errors)
  }
}

module.exports = { login, list, register }
