const express = require("express");
const path = require("path");
const app = express();
const port = process.env.port || 7000;
const morgan = require('morgan');

const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.use(morgan('tiny'));

app.listen(port, () => console.log('Server Running on port: ' + port));

app.get('/', (req, res) => {res.sendFile(path.join(__dirname, "views/home.html"))});
app.get('*', (req, res) => {res.status(404).send('404 not found. <br> ¡Houston, tenemos problemas!');})

