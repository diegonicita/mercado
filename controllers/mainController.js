// const db = require('../database/models');
const { Product } = require('../database/models')

const controller = {
    index: (req, res) => 
        {
            res.locals.ads = true; // muestras las propagandas del header //
            Product.findAll()
              .then( 
                    p => { 
                    res.render("home", {productos: p});
                    })
              .catch(error => res.send(error));
        },
}

module.exports = controller;