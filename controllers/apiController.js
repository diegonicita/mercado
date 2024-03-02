// const db = require('../database/models');
const { Product, Clasificacion, Pregunta } = require('../database/models')
var toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const { Op, Sequelize } = require('sequelize')
const transporter = require('../utils/mailer.js')
const { randomUUID } = require('node:crypto');

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
    const desde = req.query.desde ?? 0
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
  examenesDisponibles: (req, res) => {
    const maxExamenId = 6 // Valor máximo de examenId
    const examenes = {} // Objeto para almacenar los recuentos de preguntas por año para cada examen

    const iterateExams = (examenId) => {
      if (examenId > maxExamenId) {
        // Cuando hayamos iterado a través de todos los exámenes, enviar el objeto examenes como respuesta JSON
        res.json(examenes)
        return
      }

      Pregunta.findAll({
        attributes: [
          'ano', // Atributo para agrupar por año
          [Sequelize.fn('COUNT', Sequelize.col('ano')), 'count'], // Contar preguntas por año
        ],
        where: {
          examen: examenId,
        },
        group: ['ano'], // Agrupar resultados por año
        raw: true, // Devolver resultados como objetos JSON en lugar de instancias de modelos Sequelize
      })
        .then((result) => {
          // Almacenar el resultado en el objeto examenes para el examen actual
          examenes[examenId] = result

          // Llamar a la función recursivamente para el siguiente examen
          iterateExams(examenId + 1)
        })
        .catch((error) => res.send(error))
    }

    // Iniciar el bucle desde el examen 0
    iterateExams(0)
  },
  emailCode: async (req, res) => {
    const { email } = req.params
    const result = await transporter.sendMail({
      from: 'Examenes ' + process.env.EMAIL,
      to: email,
      subject: 'Codigo de Verificación',
      text: randomUUID().toString(),
    })
    console.log(result)
    res.status(200).json({ ok: true, message: 'Código enviado con éxito!' })
  },
}

module.exports = controller
