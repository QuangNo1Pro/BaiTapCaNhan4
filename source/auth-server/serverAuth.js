const express = require('express')
const path = require('path')
const fs = require('fs')
require('dotenv').config()
const passport = require('passport')
const { engine } = require('express-handlebars')
const https = require('https')
const {WebSocketServer} = require('ws')
const session = require('express-session')
const { initializePassport } = require('./config/passport')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const PORT_AUTH = process.env.DB_PORT_SERVER_AUTH
const app = express()

app.use(cors({
  origin: 'http://localhost:22296', // Địa chỉ của game server
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware xử lý
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// Cấu hình session
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,httpOnly: true,  maxAge: 1000 * 60 * 60 * 24 * 7 }
}))

// Khởi tạo passport
app.use(passport.initialize())
app.use(passport.session())
initializePassport(passport)

// Template engine
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layout')
  })
)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// Router
const authRouter = require('../auth-server/routers/authRouters')
app.use(authRouter)

const options = {
  key: fs.readFileSync('../source/auth-server/sslkeys/key.pem'),
  cert: fs.readFileSync('../source/auth-server/sslkeys/cert.pem')
}
const server = https.createServer(options, app)
const wss = new WebSocketServer({ server})
wss.on('connection', ws => {
  ws.on('error', console.error)
  ws.on('message', data => {
    const obj = JSON.parse(data)
    chats.push(obj)
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([obj]))
      }
    })
  })
})

server.listen(PORT_AUTH, () => {
  console.log(`Server Auth is running on https://localhost:${PORT_AUTH}`)
})
