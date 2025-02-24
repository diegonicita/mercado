module.exports = (sequelize, dataTypes) => {
	const alias = "User";
	const cols = {
		id: {
			type: dataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		username: { type: dataTypes.STRING(100), allowNull: false },
		email: { type: dataTypes.STRING(100), allowNull: false },
		password: { type: dataTypes.STRING(100), allowNull: false },
		role: { type: dataTypes.STRING(100), allowNull: false },
		image: { type: dataTypes.STRING(255), allowNull: true },
		code: { type: dataTypes.STRING(100), allowNull: true },
		verify: { type: dataTypes.TINYINT, allowNull: true, defaultValue: 0 },
		codes: { type: dataTypes.STRING(100), allowNull: true },
		codeExpires: { type: dataTypes.DATE, allowNull: true },
		resetCode: { type: dataTypes.STRING(100), allowNull: true },
		resetCodeExpires: { type: dataTypes.DATE, allowNull: true },
		resetCodeAttempts: {
			type: dataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0,
		},
	};
	const config = {
		tableName: "usuarios",
		timestamps: false,
	};

	const User = sequelize.define(alias, cols, config);
	return User;
};
