
const { Product } = require('../database/models')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
    detail: (req, res) => 
        {
    Product.findByPk(req.params.id).then((result) => {

        res.render("detail", { product: result, toThousand });
        
    }).catch((err) => {
        res.send(err);
        
    });
}
}

module.exports = controller;