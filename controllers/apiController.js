// const db = require('../database/models');
const { Product, Clasificacion, Pregunta } = require('../database/models')
var toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const { Op } = require('sequelize')

const controller = {
  index: (req, res) => {
    res.locals.ads = true // muestras las propagandas del header //
    Product.findAll()
      .then((p) => {
        res.send(JSON.stringify(p))
      })
      .catch((error) => res.send(error))
  },
  clasificaciones: (req, res) => {
    Clasificacion.findAll()
      .then((p) => {
        res.send(JSON.stringify(p))
      })
      .catch((error) => res.send(error))
  },
  preguntas: (req, res) => {
    Pregunta.findByPk(req.params.id)
      .then((p) => {
        if (p) res.send(JSON.stringify(p))
        else res.send({ res: 'nada' })
      })
      .catch((error) => res.send(error))
  },
  examenes: (req, res) => {
    const limite = parseInt(req.query.limite) ?? 10
    const desde = req.query.desde  ?? 0
    const examen = req.query.examen ?? 0
    const ano = req.query.ano ?? 2004

    Pregunta.findAll({
      limit: limite,
      where: {
        numero: { [Op.gte]: desde },
        examen: { [Op.eq]: examen },
        ano: { [Op.eq]: ano },
      },
    })
      .then((p) => {
        if (p) res.send(JSON.stringify(p))
        else res.send({ res: 'nada' })
      })
      .catch((error) => res.send(error))
  },
}

module.exports = controller
