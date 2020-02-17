const autoBind = require('auto-bind')

const ScrapService = require('../services/ScrapService')

class ScrapController {
  constructor () {
    this.scrapService = new ScrapService()

    autoBind(this)
  }

  async scrapAccount (req, res, next) {
    try {
      const accoutnData = await this.scrapService.scrapAccount(req.body)

      res.json(accoutnData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ScrapController
