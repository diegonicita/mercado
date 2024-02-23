const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)
const cors = require('cors')
const path = require('path')

const cookieParser = require('cookie-parser')
app.use(cookieParser())
const passport = require('passport')
require('dotenv').config({ path: '.env' })
// Configurar CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : []
app.use(cors({ origin: allowedOrigins, credentials: true }))
const morgan = require('morgan')

// Middleware
const publicPath = path.resolve(__dirname, './public')
app.use(express.static(publicPath))
app.use(morgan('tiny'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
require('./middlewares/google-mercado.js')
require('./middlewares/google-examenes.js')

const mainRoutes = require('./routes/main.js')
const userRoutes = require('./routes/user.js')
const productsRoutes = require('./routes/products.js')
const apiRoutes = require('./routes/api.js')
const authRoutes = require('./routes/auth.js')
const authRoutes2 = require('./routes/auth2.js')

app.use('/', mainRoutes)
app.use('/api', apiRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use(
  '/auth',
  passport.authenticate('examenes', {
    scope: ['profile', 'email'],
    session: false,
  }),
  authRoutes,
)

app.use(
  '/auth2',
  passport.authenticate('mercado', {
    scope: ['profile', 'email'],
    session: false,
  }),
  authRoutes2,
)

const socketManager = require('./utils/socketManager.js')
socketManager(io, cors)

server.listen(process.env.PORT, () =>
  console.log('Server Running on localhost:' + process.env.PORT),
)
