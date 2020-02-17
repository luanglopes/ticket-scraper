const { Router } = require('express')

const Scrapcontroller = require('./controllers/ScrapController')

const router = Router()
const scrapController = new Scrapcontroller()

router.post('/scrap', scrapController.scrapAccount)

module.exports = router
