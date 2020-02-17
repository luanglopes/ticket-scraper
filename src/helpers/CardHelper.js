class CardHelper {
  static getType (typeSlug) {
    switch (typeSlug) {
      case 'tre':
        return 'Refeição'
      case 'tae':
        return 'Alimentação'
      default:
        return typeSlug
    }
  }
}

module.exports = CardHelper
