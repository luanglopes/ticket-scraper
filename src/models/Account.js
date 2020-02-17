const mongoose = require('mongoose')

const { Schema } = mongoose

const cardSchema = new Schema({
  alias: String,
  status: String,
  type: { type: String },
  balance: Number
})

const accountSchema = new Schema({
  email: String,
  last_update: Date,
  user: {
    type: Schema.Types.Mixed
  },
  cards: [cardSchema]
})

module.exports = mongoose.model('Account', accountSchema)
