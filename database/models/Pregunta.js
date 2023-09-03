module.exports = (sequelize, dataTypes) => {
    let alias = 'Pregunta'
    let cols = {
      id: { type: dataTypes.INTEGER, allowNull: false, primaryKey: true },
      numero: { type: dataTypes.INTEGER, allowNull: false },
      opciones: { type: dataTypes.TINYINT, allowNull: false },
      correcta: { type: dataTypes.TINYINT, allowNull: false },
      tema:     { type: dataTypes.TINYINT, allowNull: false },
      examen:   { type: dataTypes.TINYINT, allowNull: false },
      ano: { type: dataTypes.INTEGER, allowNull: false },
      clasifica1: { type: dataTypes.TINYINT, allowNull: false },
      clasifica2: { type: dataTypes.TINYINT, allowNull: false },
      clasifica3: { type: dataTypes.TINYINT, allowNull: false },
      clasifica4: { type: dataTypes.TINYINT, allowNull: false },
      clasifica5: { type: dataTypes.TINYINT, allowNull: false },
      texto: { type: dataTypes.TEXT, allowNull: false },
      opcion1: { type: dataTypes.TEXT, allowNull: false },
      opcion2: { type: dataTypes.TEXT, allowNull: false },
      opcion3: { type: dataTypes.TEXT, allowNull: false },
      opcion4: { type: dataTypes.TEXT, allowNull: false },
      opcion5: { type: dataTypes.TEXT, allowNull: false },
      comentario: { type: dataTypes.TEXT, allowNull: false },
    }
    let config = {
      tableName: 'Preguntas',
      timestamps: false,
    }
  
    const Pregunta = sequelize.define(alias, cols, config)
    return Pregunta
  }