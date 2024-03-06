const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { User } = require('../database/models')
const jwt = require('jsonwebtoken')
const transporter = require('../utils/mailer.js')
const { randomUUID } = require('node:crypto')

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
      attributes: ['id', 'username', 'password', 'email', 'role', 'verify'],
    })
      .then((userFound) => {
        if (
          userFound != null &&
          bcrypt.compareSync(req.body.password, userFound.dataValues.password)
        ) {
          // Create token
          var token = jwt.sign(
            {
              id: userFound.dataValues.id,
              email: emailFromBody,
              username: userFound.dataValues.username,
              role: userFound.dataValues.role,
              verify: userFound.dataValues.verify,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: '2h',
            },
          )

          res.cookie('token', token, {
            httpOnly: process.env.HTTP_ONLY === 'true',
            maxAge: parseInt(process.env.MAX_AGE, 10),
            secure: process.env.SECURE_COOKIE === 'true',
            sameSite: process.env.SAME_SITE,
            path: '/',
            domain:
              process.env.ENVIRONMENT === 'development' ? '' : `.examenes.com.ar`, 
          })

          createResponse({
            res: res,
            status: 200,
            isError: false,
            errors: null,
            message: 'Login exitoso',
            userResponse: {
              id: userFound.id,
              username: userFound.username,
              email: userFound.email,
              rol: userFound.role,
            },
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
  res.send('list')
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
        role: 'user',
        verify: false,
        code: randomUUID().toString(),
      })

      // Create token for the new user
      const token = jwt.sign(
        {
          id: newUser.id,
          email: email.trim(),
          username: username,
          role: 'user',
          verify: false,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        },
      )
      createResponse({
        res: res,
        status: 201,
        isError: false,
        errors: null,
        message: 'Registro exitoso',
        userResponse: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        token: token,
      })
    } catch (error) {
      console.log(error)

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

const profile = async (req, res) => {
  User.findByPk(req.params.id)
    .then((result) => {
      result.password = undefined
      res.json(result.dataValues)
      console.log(result.dataValues)
    })
    .catch((err) => {
      res.send(err)
    })
}

const sendEmail = async (req, res) => {
  const emailFromBody = req.body?.email?.trim()
  const usuario = await User.findOne({
    where: { email: emailFromBody },
    attributes: ['email', 'code', 'verify'],
  })
  if (usuario && usuario.verify) {
    return res.status(400).json({ isError: true, message: 'user verified' })
  }
  if (usuario) {
    const result = await transporter.sendMail({
      from: 'Examenes ' + process.env.EMAIL,
      to: emailFromBody,
      subject: 'Codigo de Verificación',
      text: usuario?.code,
    })
    console.log(result)
    return res.status(200).json({ isError: false, message: 'success' })
  } else {
    await new Promise((res) => setTimeout(res, 2000))
    return res.status(400).json({ isError: true, message: 'error' })
  }
}

const sendCode = async (req, res) => {
  const emailFromBody = req.body?.email?.trim()
  const codeFromBody = req.body?.code?.trim()
  const usuario = await User.findOne({
    where: { email: emailFromBody },
    attributes: ['email', 'code', 'verify'],
  })
  console.log(usuario)
  if (usuario && usuario.verify) {
    return res.status(400).json({ isError: true, message: 'user verified' })
  }
  console.log(codeFromBody)
  console.log(usuario.code)
  if (usuario && codeFromBody === usuario.code) {
    const updatedUser = await User.update(
      { verify: true },
      { where: { email: emailFromBody } },
    )
    console.log(updatedUser)
    return res.status(200).json({ isError: false, message: 'success' })
  } else {
    // await new Promise((res) => setTimeout(res, 2000))
    return res.status(400).json({ isError: true, message: 'error' })
  }
}

module.exports = { login, list, register, profile, sendEmail, sendCode }
