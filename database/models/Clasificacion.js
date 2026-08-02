module.exports = (sequelize, dataTypes) => {
	const alias = "Clasificacion";
	const cols = {
		id: { type: dataTypes.INTEGER, allowNull: false, primaryKey: true },
		tema: { type: dataTypes.STRING(100), allowNull: false },
	};
	const config = {
		tableName: "clasificaciones",
		timestamps: false,
	};

	const Clasificacion = sequelize.define(alias, cols, config);
	return Clasificacion;
};
