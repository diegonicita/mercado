const express = require("express");
const path = require("path");
const app = express();

// server.js
console.log(`Your port is ${process.env.PORT}`); // undefined
const dotenv = require('dotenv');
dotenv.config();

console.log("Your port is " + process.env.PORT); // 3000
console.log("Your username is " + process.env.USERDATABASE); // root
console.log("Your password is " + process.env.PASSWORD); //
console.log("Your database is " + process.env.DATABASE); //
console.log("Your host is " + process.env.HOST); //
console.log("Your dialect is " + process.env.DIALECT); //

const morgan = require('morgan');

const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.use(morgan('tiny'));
app.set('view engine', 'ejs')

app.listen(process.env.PORT, () => console.log('Server Running on port: ' + process.env.PORT));

const mainRoutes = require('./routes/main.js');
const userRoutes = require('./routes/user.js');
// const productsRoutes = require('./routes/products.js');

app.use("/", mainRoutes);
app.use("/users", userRoutes);

// app.use("/products", productsRoutes);

// const db = require('./database/models');
// const { Product } = require('./database/models')

// app.get('/login', (req, res) => {res.render("login")});
// app.get('/register', (req, res) => {res.render("register")});
// app.get('/', (req, res) => {

//     Product.findAll()
//         .then( 
//             p => { 
//             res.render("home", {productos: p});
//             })
//         .catch(error => res.send(error));
// });

// app.get('/error', (req, res) => {res.render("error")});
// app.get('*', (req, res) => {res.render("error")});

// Paleta de colores

// Amarillo: #EAC926;
// Azul: #03264C;
// Celeste: #1259c3;
// Gris oscuro: #666;
// Gris claro: #ebebeb;
// Verde: #39b54a;
