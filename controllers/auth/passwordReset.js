const { User } = require("../../database/models");
const { generateSixDigitCode } = require("../../utils/codeGenerator");
const transporter = require("../../utils/mailer");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email: email.trim() },
    });

    if (user) {
      const resetCode = generateSixDigitCode();
      const resetCodeExpires = new Date(Date.now() + 3600000);

      await User.update(
        {
          resetCode,
          resetCodeExpires,
          resetCodeAttempts: 0,
        },
        { where: { email: email.trim() } }
      );

      await transporter.sendMail({
        from: `"Examenes" <${process.env.EMAIL}>`,
        to: email.trim(),
        subject: "Recuperación de Contraseña",
        html: `
          <h1>Recuperación de Contraseña</h1>
          <p>Tu código de recuperación es: <strong>${resetCode}</strong></p>
          <p>Este código expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `,
      });
    }

    return res.status(200).json({
      isError: false,
      message: "Si el email existe, recibirás un código de recuperación",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({
      isError: true,
      message: "Error al procesar la solicitud",
    });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        isError: true,
        message: "Email y código son requeridos",
      });
    }

    const user = await User.findOne({
      where: {
        email: email.trim(),
        resetCode: code,
        resetCodeExpires: { [Op.gt]: new Date() },
      },
    });
    if (!user.verify) {
      await User.update(
        {
          verify: true,
        },
        { where: { email: email.trim() } }
      );
    }

    if (!user) {
      return res.status(400).json({
        isError: true,
        message: "Código inválido o expirado",
      });
    }

    if (user.resetCodeAttempts >= 3) {
      return res.status(400).json({
        isError: true,
        message: "Demasiados intentos. Solicita un nuevo código",
      });
    }

    const tempToken = jwt.sign(
      {
        email: user.email,
        resetCode: code,
        type: "password_reset",
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      isError: false,
      message: "Código verificado correctamente",
      tempToken,
    });
  } catch (error) {
    console.error("Reset code verification error:", error);
    return res.status(500).json({
      isError: true,
      message: "Error al verificar código",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;

    if (!tempToken || !newPassword) {
      return res.status(400).json({
        isError: true,
        message: "Token temporal y nueva contraseña son requeridos",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.TOKEN_KEY);
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(400).json({
        isError: true,
        message: "Token inválido o expirado",
      });
    }

    const { email, resetCode, type } = decoded;

    if (type !== "password_reset") {
      return res.status(400).json({
        isError: true,
        message: "Token inválido",
      });
    }

    const user = await User.findOne({
      where: {
        email,
        resetCode,
        resetCodeExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        isError: true,
        message: "Sesión inválida o expirada",
      });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await User.update(
      {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpires: null,
        resetCodeAttempts: null,
      },
      { where: { email } }
    );

    return res.status(200).json({
      isError: false,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({
      isError: true,
      message: "Error al restablecer contraseña",
    });
  }
};

module.exports = {
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
