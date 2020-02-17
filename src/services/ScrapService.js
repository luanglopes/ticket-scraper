const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const PageHelper = require('../helpers/PageHelper')
const CardHelper = require('../helpers/CardHelper')
const AccountRepository = require('../repositories/AccountRepository')

class ScrapService {
  constructor () {
    this.accountRepository = new AccountRepository()
  }

  async _loginAccount (loginPage, { email, password }) {
    await loginPage.type('#email', email)
    await loginPage.type('#senha', password)
    await loginPage.click('form[novalidate] > div > button')

    await loginPage.waitFor('#histFaturamento > div.titulo_destaque_extrato')
    await loginPage.waitFor('section.carousel-wrapper > ul')
  }

  async _extractUserData (browser) {
    const userPage = await PageHelper.create(browser, {
      url: 'https://www.ticket.com.br/portal-usuario/minha-conta/',
      watiForSelectors: ['div.cadastro > div.cont5 > h2']
    })

    const $ = cheerio.load(await userPage.content())
    const infos = $('div.cadastro .cont5').toArray().map(el => el.children)
    const data = {}

    infos.forEach(info => {
      const prop = info[0].childNodes[0].data
      let value

      if (info[1].childNodes[0]) {
        value = info[1].childNodes[0].data
      }

      data[prop] = value
    })

    return data
  }

  async _extractCardsData (browser) {
    const cardsPage = await PageHelper.create(browser, {
      url: 'https://www.ticket.com.br/portal-usuario/meus-cartoes',
      watiForSelectors: ['#histFaturamento > div.table-auto', 'section.carousel-wrapper > ul']
    })

    const $ = cheerio.load(await cardsPage.content())
    const cardsList = $('section.carousel-wrapper > ul > li .cartao').toArray().map(el => el.children)
    const cards = []

    cardsList.forEach(card => {
      const cardHearder = card[0].children[0]
      const cardBalance = card[1].children.slice(1)
      const cardFooter = card[2].children

      const typeIndicatorSplitedClasses = cardHearder.attribs.class.split('-').map(part => part.trim())
      const type = CardHelper.getType(typeIndicatorSplitedClasses[typeIndicatorSplitedClasses.length - 1])

      const balance = `${cardBalance[0].data}${cardBalance[1].children[0].data}`.replace(',', '.').trim()

      const alias = cardFooter[0].children[1].children[0].data.trim()
      const status = cardFooter[2].children[0].data.trim()

      cards.push({ type, balance: parseFloat(balance, 10), alias, status })
    })

    return cards
  }

  async scrapAccount ({ email, password }) {
    const browser = await puppeteer.launch({ headless: true })
    const loginPage = await PageHelper.create(browser, {
      url: 'https://www.ticket.com.br/portal-usuario/login/',
      watiForSelectors: ['#email', '#senha']
    })

    await this._loginAccount(loginPage, { email, password })

    const [user, cards] = await Promise.all([this._extractUserData(browser), this._extractCardsData(browser)])

    const data = { user, cards }

    browser.close().catch(console.error)
    this.accountRepository.upsert(email, data).catch(console.error)

    return data
  }
}

module.exports = ScrapService
