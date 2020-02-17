const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')

const router = require('./router')

class App {
  constructor () {
    this.express = express()
  }

  async prepare () {
    await this.database()
    this.middlewares()
    this.routes()

    return this.express
  }

  async database () {
    try {
      await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    } catch (error) {
      console.log('Error connecting database', error)
      process.exit(1)
    }
  }

  middlewares () {
    this.express.use(cors({ origin: true }))
    this.express.use(helmet())
    this.express.use(express.json())
    this.express.use(express.static('public'))
  }

  routes () {
    this.express.use('/api', router)
  }
}

module.exports = App
