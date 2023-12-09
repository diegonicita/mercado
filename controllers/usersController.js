const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { User } = require('../database/models')
const jwt = require('jsonwebtoken')

const createResponse = ({
  res,
  status,
  isError,
  errors,
  message,
  userResponse,
  token,
}) => {
  return res.status(status).send({
    isError,
    errors,
    message,
    userResponse,
    token,
    status,
  })
}

const login = async (req, res) => {
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

          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 900000, 
            secure: false,
            sameSite: 'strict',
            path: '/',           
          })
         
          createResponse({
            res: res,
            status: 200,
            isError: false,
            errors: null,
            message: 'Login exitoso',
            userResponse: { email: userFound.email },
            token: token,
          })
        } else {
          createResponse({
            res: res,
            status: 401,
            isError: true,
            errors: null,
            message: 'Las credenciales no son correctos',
            userResponse: {},
            token: null,
          })
        }
      })
      .catch((error) => res.send(error))
  } else {
    createResponse({
      res: res,
      status: 400,
      isError: true,
      errors: errors.array(),
      message: 'Errores de validacion',
      userResponse: {},
      token: null,
    })
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
      return createResponse({
        res: res,
        status: 400,
        isError: true,
        errors: null,
        message: 'El usuario ya existe',
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
      createResponse({
        res: res,
        status: 201,
        isError: false,
        errors: null,
        message: 'Registro exitoso',
        userResponse: { email: newUser.email },
        token: token,
      })
    } catch (error) {
      createResponse({
        res: res,
        status: 500,
        isError: true,
        errors: error,
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
