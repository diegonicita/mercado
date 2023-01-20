const db = require('../database/models')
const { Product } = require('../database/models')
var toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { hardcodedData, useHardcodedData } = require('./hardcodedData')

const controller = {
  index: (req, res) => {
    if (!useHardcodedData) {      
      res.locals.ads = true // muestras las propagandas del header //

      // Search in Database //
      var object = {};
      if (req.query.search)
      {
      object.where = {[Op.or]:[{ 
                      descripcion: {
                              [Op.like]: '%'+ req.query.search + '%'
                           }},{ 
                      titulo: {
                          [Op.like]: '%'+ req.query.search + '%'
                           }}]
                           
                          } 
      }

      Product.findAll(object)
        .then((p) => {
          res.render('home', { productos: p, toThousand: toThousand })
        })
        .catch((error) => res.send(error))
    } else {
      
      // Search in Hardcoded Data //
      const listaProductos = hardcodedData();
      var terminoBuscado = ""      
      if (req.query.search) terminoBuscado = req.query.search.toLowerCase();      
      var newArray = listaProductos.filter( item => item.titulo.toLowerCase().includes(terminoBuscado) )      
      res.render('home', { productos: newArray, toThousand: toThousand })
    }
  }
}

module.exports = controller
