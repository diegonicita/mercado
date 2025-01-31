const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { User } = require("../database/models");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer.js");
const { randomUUID } = require("node:crypto");
const { Op } = require("sequelize");

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
  });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  const emailFromBody = req.body?.email?.trim();
  if (errors.isEmpty()) {
    await User.findOne({
      where: { email: emailFromBody },
      attributes: ["id", "username", "password", "email", "role", "verify"],
    })
      .then((userFound) => {
        if (
          userFound != null &&
          bcrypt.compareSync(req.body.password, userFound.dataValues.password)
        ) {
          // Create token
          const token = jwt.sign(
            {
              id: userFound.dataValues.id,
              email: emailFromBody,
              username: userFound.dataValues.username,
              role: userFound.dataValues.role,
              verify: userFound.dataValues.verify,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          res.cookie("token", token, {
            httpOnly: process.env.HTTP_ONLY === "true",
            maxAge: Number.parseInt(process.env.MAX_AGE, 10),
            secure: process.env.SECURE_COOKIE === "true",
            sameSite: process.env.SAME_SITE,
            path: "/",
            domain:
              process.env.ENVIRONMENT === "development"
                ? ""
                : "examenes.com.ar",
          });

          createResponse({
            res: res,
            status: 200,
            isError: false,
            errors: null,
            message: "Login exitoso",
            userResponse: {
              id: userFound.id,
              username: userFound.username,
              email: userFound.email,
              rol: userFound.role,
            },
            token: token,
          });
        } else {
          createResponse({
            res: res,
            status: 401,
            isError: true,
            errors: null,
            message: "Las credenciales no son correctos",
            userResponse: {},
            token: null,
          });
        }
      })
      .catch((error) => res.send(error));
  } else {
    createResponse({
      res: res,
      status: 400,
      isError: true,
      errors: errors.array(),
      message: "Errores de validacion",
      userResponse: {},
      token: null,
    });
  }
};

const list = (req, res) => {
  res.send("list");
};
function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const register = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { username, email, password } = req.body;

    try {
      // Check existing user
      const existingUser = await User.findOne({
        where: { email: email.trim() },
        attributes: ["id"],
      });

      if (existingUser) {
        return createResponse({
          res: res,
          status: 400,
          isError: true,
          errors: null,
          message: "El usuario ya existe",
          userResponse: {},
          token: null,
        });
      }

      // If the user doesn't exist, hash the password and create a new user
      const hashedPassword = bcrypt.hashSync(password, 10);
      const defaultImage =
        "https://mercado.webapp.ar/images_medicina/avatars/walrus.png";
      const defaultRole = "user-1";
      const verificationCode = generateSixDigitCode();

      const newUser = await User.create({
        username,
        email: email.trim(),
        password: hashedPassword,
        role: defaultRole,
        verify: false,
        code: verificationCode,
        image: defaultImage,
      });

      console.log("User created successfully, attempting to send email...");

      // Send verification email
      const verificationEmail = await transporter.sendMail({
        from: `"Examenes" <${process.env.EMAIL}>`,
        to: email.trim(),
        subject: "Codigo de Verificación",
        text: `Tu código de verificación es: ${verificationCode}`,
        html: `
          <h1>Bienvenido a Examenes!</h1>
          <p>Tu código de verificación es: <strong>${verificationCode}</strong></p>
          <p>Por favor usa este código para verificar tu cuenta.</p>
        `,
      });

      console.log("Verification email sent:", verificationEmail.messageId);

      // Create token AFTER user is created
      const token = jwt.sign(
        {
          id: newUser.id,
          email: email.trim(),
          username: username,
          role: defaultRole,
          verify: false,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // Send response with token
      return createResponse({
        res: res,
        status: 201,
        isError: false,
        errors: null,
        message:
          "Registro exitoso, por favor verifica tu correo para activar tu cuenta",
        userResponse: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        token: token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return createResponse({
        res: res,
        status: 500,
        isError: true,
        errors: error,
        message: "Error al registrar el usuario",
        userResponse: {},
        token: null,
      });
    }
  } else {
    return res.status(400).json(errors);
  }
};

const profile = async (req, res) => {
  User.findByPk(req.params.id)
    .then((result) => {
      result.password = undefined;
      res.json(result.dataValues);
      console.log(result.dataValues);
    })
    .catch((err) => {
      res.send(err);
    });
};

const sendCode = async (req, res) => {
  const codeFromBody = req.body?.code?.toString();
  const emailFromToken = req.user.email; // Get email from the token

  if (!codeFromBody) {
    return res.status(400).json({
      isError: true,
      message: "Código es requerido",
    });
  }

  const usuario = await User.findOne({
    where: { email: emailFromToken },
    attributes: ["email", "code", "verify"],
  });

  if (!usuario) {
    return res.status(404).json({
      isError: true,
      message: "Usuario no encontrado",
    });
  }

  if (usuario.verify) {
    return res.status(400).json({
      isError: true,
      message: "Usuario ya verificado",
    });
  }

  console.log("Comparing codes:", {
    provided: codeFromBody,
    stored: usuario.code,
  });

  console.log(codeFromBody, usuario.code);

  if (codeFromBody === usuario.code) {
    try {
      await User.update(
        { verify: true, code: null }, // Clear the code after verification
        { where: { email: emailFromToken } }
      );

      return res.status(200).json({
        isError: false,
        message: "Cuenta verificada exitosamente",
      });
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({
        isError: true,
        message: "Error al verificar la cuenta",
      });
    }
  }

  return res.status(400).json({
    isError: true,
    message: "Código inválido",
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email: email.trim() },
    });

    if (!user.verify) {
      return res.status(400).json({
        isError: true,
        message:
          "Debes verificar tu cuenta antes de poder restablecer la contraseña",
      });
    }

    // Generate reset code
    const resetToken = generateSixDigitCode();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token and expiry
    await User.update(
      {
        resetToken,
        resetTokenExpires,
      },
      {
        where: { email: email.trim() },
      }
    );

    // Send reset email
    await transporter.sendMail({
      from: `"Examenes" <${process.env.EMAIL}>`,
      to: email.trim(),
      subject: "Recuperación de Contraseña",
      text: `Tu código de recuperación es: ${resetToken}`,
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Tu código de recuperación es: <strong>${resetToken}</strong></p>
        <p>Este código expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
      `,
    });

    return res.status(200).json({
      isError: false,
      message: "Si el email existe, recibirás un código de recuperación",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      isError: true,
      message: "Error al procesar la solicitud",
    });
  }
};

// Reset password with code
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validate input
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        isError: true,
        message: "Todos los campos son requeridos",
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email: email.trim(),
        resetToken: code,
        resetTokenExpires: {
          [Op.gt]: new Date(), // Token hasn't expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        isError: true,
        message: "Código inválido o expirado",
      });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update password and clear reset token
    await User.update(
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
      {
        where: { email: email.trim() },
      }
    );

    return res.status(200).json({
      isError: false,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      isError: true,
      message: "Error al restablecer la contraseña",
    });
  }
};

module.exports = {
  login,
  list,
  register,
  profile,
  sendCode,
  forgotPassword,
  resetPassword,
};
