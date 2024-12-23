const express = require('express')
const passport = require('passport')
const { engine } = require('express-handlebars')
const app = express()
require('dotenv').config(); // Đảm bảo nạp file .env
const path = require('path')
const session = require('express-session')
const { initializePassport } = require('../auth-server/config/passport'); // Đảm bảo có file passport.js hợp lệ

const PORT_GAME = process.env.DB_PORT_SERVER_GAME

// Middleware xử lý
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Cấu hình session
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }, // Cấu hình cookie không bảo mật khi phát triển (https cần secure: true)
  })
)

// Khởi tạo passport
app.use(passport.initialize())
app.use(passport.session())
initializePassport(passport)

// Template engine
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
      rank: (index) => index + 1, 
    }
  })
)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// Routes
const gameRouter = require('./routers/gameRouters'); // Đảm bảo có router đúng
app.use(gameRouter)

// Lắng nghe trên cổng game server
app.listen(PORT_GAME, () => {
  console.log(`Server GAME is running on http://localhost:${PORT_GAME}`)
})
