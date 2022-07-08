import express from "express"
import cors from 'cors'

const app = express()
const port = 5005

app.use(cors())
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.send('hello!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})