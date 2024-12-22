const express = require('express')
const app = express()
require('dotenv').config()
const PORT_GAME = process.env.DB_PORT_SERVER_GAME

app.listen(PORT_GAME, () => {
  console.log(`Server GAME is running on http://localhost:${PORT_GAME}`)
})
