const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const passport = require('passport')
require('dotenv').config({ path: '.env' })
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
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
require('./middlewares/google.js')

app.listen(process.env.PORT, () =>
  console.log('Server Running on port: ' + process.env.PORT),
)

const mainRoutes = require('./routes/main.js')
const userRoutes = require('./routes/user.js')
const productsRoutes = require('./routes/products.js')
const apiRoutes = require('./routes/api.js')
const authRoutes = require('./routes/auth.js')

app.use('/', mainRoutes)
app.use('/api', apiRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/auth', authRoutes)
