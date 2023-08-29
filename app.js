const express = require('express')
const path = require('path')
const app = express()
// Configurar CORS
app.use(cors())
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()

// Middleware
const publicPath = path.resolve(__dirname, './public')
app.use(express.static(publicPath))
app.use(morgan('tiny'))
app.set('view engine', 'ejs')

app.listen(process.env.PORT, () =>
  console.log('Server Running on port: ' + process.env.PORT),
)

const mainRoutes = require('./routes/main.js')
const userRoutes = require('./routes/user.js')
const productsRoutes = require('./routes/products.js')
const apiRoutes = require('./routes/api.js')

app.use('/', mainRoutes)
app.use('/api', apiRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
