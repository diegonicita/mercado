const { User } = require("../../database/models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const verifyEmailCode = async (req, res) => {
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
        codes,
        verify: false,
        codeExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        isError: true,
        message: "Código inválido o expirado",
      });
    }

    // Update user verification status
    await User.update(
      {
        verify: true,
        codes: null,
        codeExpires: null,
      },
      { where: { email: email.trim() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      isError: false,
      message: "Email verificado correctamente",
      token,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      isError: true,
      message: "Error al verificar email",
    });
  }
};

module.exports = {
  verifyEmailCode,
};
