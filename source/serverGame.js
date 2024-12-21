const express = require('express')
const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello from Server B')
// })

app.listen(4000, () => {
  console.log('Server B is running on http://localhost:4000')
})
