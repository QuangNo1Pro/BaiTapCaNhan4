const express = require('express')
require('dotenv').config()
const PORT = process.env.INDIVIDUAL_MARK

const app = express()

// Router home
const moviesRoutes = require('./routers/moviesRouter')
// Sử dụng router cho movies
app.use( moviesRoutes)

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`)
})



