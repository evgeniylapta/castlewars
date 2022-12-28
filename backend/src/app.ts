const express = require('express')
const app = express()

app.get('/test', (req, res) => {
  res.send('test')
})

// const port = process.env.PORT
const port = '4000'

app.listen(port, () => {
  console.log(`started on ${port}`)
})
