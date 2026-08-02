const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { User } = require("../database/models");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer.js");
const { verifyEmailCode } = require("./auth/emailVerification");
const {
	forgotPassword,
	verifyResetCode,
	resetPassword,
} = require("./auth/passwordReset");

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
			attributes: [
				"id",
				"username",
				"password",
				"email",
				"role",
				"verify",
			],
		})
			.then((userFound) => {
				if (
					userFound != null &&
					bcrypt.compareSync(
						req.body.password,
						userFound.dataValues.password,
					)
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
							expiresIn: "30d",
						},
					);

					res.cookie("token", token, {
						httpOnly: process.env.HTTP_ONLY === "true",
						maxAge: 30 * 24 * 3600 * 1000, // 30 days
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

			const newUser = await User.create({
				username,
				email: email.trim(),
				password: hashedPassword,
				role: defaultRole,
				verify: false,
				code: null,
				image: defaultImage,
			});

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
				},
			);

			// Send response with token
			return createResponse({
				res: res,
				status: 201,
				isError: false,
				errors: null,
				message: "Registro exitoso",
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

	console.log(codeFromBody, usuario.code);

	if (codeFromBody === usuario.code) {
		try {
			await User.update(
				{ verify: true, code: null }, // Clear the code after verification
				{ where: { email: emailFromToken } },
			);

			return res.status(200).json({
				isError: false,
				message: "Codigo verificado correctamente",
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

module.exports = {
	login,
	list,
	register,
	profile,
	sendCode,
	verifyEmailCode,
	forgotPassword,
	verifyResetCode,
	resetPassword,
};
