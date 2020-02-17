require('dotenv').config()
const http = require('http')

const App = require('./App')

new App().prepare().then((app) => {
  const server = http.createServer(app)
  const port = parseInt(process.env.PORT || '3000', 10)

  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
})
