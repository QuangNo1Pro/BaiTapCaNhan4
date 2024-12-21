const express = require('express')
const app = express()

// app.get('/', (req, res) => {
//   res.send('Hello from Server A')
// })

app.listen(3000, () => {
  console.log('Server A is running on http://localhost:3000')
})
