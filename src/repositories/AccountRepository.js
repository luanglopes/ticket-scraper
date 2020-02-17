const slugify = require('slugify')

const Account = require('../models/Account')

class AccountRepository {
  constructor () {
    this.model = Account
  }

  _normalizeObject (obj) {
    const normalizedObj = {}

    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        normalizedObj[slugify(key, { lower: true, replacement: '_' })] = obj[key]
      }
    })

    return normalizedObj
  }

  async upsert (email, { user, cards }) {
    const normalizedUser = this._normalizeObject(user)
    const normalizedCards = cards.map(this._normalizeObject)

    await this.model.updateOne({ email }, {
      email,
      last_update: new Date(),
      user: normalizedUser,
      cards: normalizedCards
    }, { upsert: true })
  }
}

module.exports = AccountRepository
