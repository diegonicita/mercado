// const db = require('../database/models');
// const { Product } = require('../database/models');
var toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const p =
[{
	id: 1, 
	titulo: 'TV Samsung', 
	create: '1900-01-01 00:00:00', 
	edited: null, 
	description: "Hola",
	eliminalbe: 1,
	precio: 10000,
	descuento: 10,
	imagen: 'img-tv-samsung-smart.jpg',
	categoria: 1
},
{
	id: 2, 
	titulo: 'MacBook Pro', 
	create: '1900-01-01 00:00:00', 
	edited: null, 
	description: "Hola",
	eliminalbe: 1,
	precio: 250000,
	descuento: 12,
	imagen: 'img-macbook-pro-2019.jpg',
	categoria: 1
},
{
	id: 3, 
	titulo: 'Cafetera Moulinex', 
	create: '1900-01-01 00:00:00', 
	edited: null, 
	description: "Hola",
	eliminalbe: 1,
	precio: 5000,
	descuento: 8,
	imagen: 'img-cafetera-moulinex.jpg',
	categoria: 1
},
{
	id: 4, 
	titulo: 'Samsung Galaxy', 
	create: '1900-01-01 00:00:00', 
	edited: null, 
	description: "Hola",
	eliminalbe: 1,
	precio: 8000,
	descuento: 15,
	imagen: 'img-samsung-galaxy-s10.jpg',
	categoria: 1
}

]
	

const controller = {
    index: (req, res) => 
        {
            res.locals.ads = true; // muestras las propagandas del header //
            //Product.findAll()
            //  .then( 
            //        p => { 
            res.render("home", {productos: p, toThousand: toThousand });
            //        })
            //  .catch(error => res.send(error));
        },
}

module.exports = controller;