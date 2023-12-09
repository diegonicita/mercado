module.exports = (sequelize, dataTypes) => {
  let alias = 'Clasificacion'
  let cols = {
    id: { type: dataTypes.INTEGER, allowNull: false, primaryKey: true },
    tema: { type: dataTypes.STRING(100), allowNull: false },
  }
  let config = {
    tableName: 'clasificaciones',
    timestamps: false,
  }

  const Clasificacion = sequelize.define(alias, cols, config)
  return Clasificacion
}
