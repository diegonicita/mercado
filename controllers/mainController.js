const db = require('../database/models')
const { Product } = require('../database/models')
var toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const { hardcodedData, useHardcodedData } = require('./hardcodedData')

const controller = {
  index: (req, res) => {
    if (useHardcodedData) {
      res.locals.ads = true // muestras las propagandas del header //
      Product.findAll()
        .then((p) => {
          res.render('home', { productos: p, toThousand: toThousand })
        })
        .catch((error) => res.send(error))
    } else {
      res.render('home', { productos: hardcodedData(), toThousand: toThousand })
    }
  }
}

module.exports = controller
