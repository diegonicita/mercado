// const db = require('../database/models');
const { Product } = require('../database/models');
var toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
    index: (req, res) => 
        {
            res.locals.ads = true; // muestras las propagandas del header //
            const headers = req.headers;
            console.log(headers);
            if (headers.hasOwnProperty('Cookie')) {
                // Cookie exists in the header
                const cookieString = headers['Cookie'];
                console.log(cookieString);
            }
            Product.findAll()
              .then( 
                    p => { 
                    res.render("home", {productos: p, toThousand: toThousand });
                    })
              .catch(error => res.send(error));
        },
}

module.exports = controller;