
const { Product } = require('../database/models')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const {hardcodedData, useHardcodedData} = require("./hardcodedData")

const controller = {
    detail: (req, res) => 
        {
    if (useHardcodedData) {
    Product.findByPk(req.params.id).then((result) => {

        res.render("detail", { product: result, toThousand });
        
    }).catch((err) => {
        res.send(err);
        
    });
        }    
    else {
     const product = hardcodedData()[req.params.id]      
      res.render("detail", { product: product, toThousand });
    }
}
}

module.exports = controller;