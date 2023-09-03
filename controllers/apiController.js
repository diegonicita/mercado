// const db = require('../database/models');
const { Product, Clasificacion } = require('../database/models')
var toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

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
}

module.exports = controller
