const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 7000;
const morgan = require('morgan');

const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.use(morgan('tiny'));

app.listen(port, () => console.log('Server Running on port: ' + port));

app.get('/login', (req, res) => {res.sendFile(path.join(__dirname, "./views/login.html"))});
app.get('/register', (req, res) => {res.sendFile(path.join(__dirname, "./views/register.html"))});
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, "./views/home.html"))});
app.get('/error', (req, res) => {res.sendFile(path.join(__dirname, "./views/error.html"))});
app.get('*', (req, res) => {res.sendFile(path.join(__dirname, "./views/error.html"))});

// Paleta de colores

// Amarillo: #EAC926;
// Azul: #03264C;
// Celeste: #1259c3;
// Gris oscuro: #666;
// Gris claro: #ebebeb;
// Verde: #39b54a;
