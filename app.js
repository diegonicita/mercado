const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 7000;
const morgan = require('morgan');

const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.use(morgan('tiny'));
app.set('view engine', 'ejs')

app.listen(port, () => console.log('Server Running on port: ' + port));

app.get('/login', (req, res) => {res.render("login")});
app.get('/register', (req, res) => {res.render("register")});
app.get('/', (req, res) => {res.render("home")});
app.get('/error', (req, res) => {res.render("error")});
app.get('*', (req, res) => {res.render("error")});

// Paleta de colores

// Amarillo: #EAC926;
// Azul: #03264C;
// Celeste: #1259c3;
// Gris oscuro: #666;
// Gris claro: #ebebeb;
// Verde: #39b54a;
