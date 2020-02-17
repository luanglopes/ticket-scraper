class PageHelper {
  static async goAndWaitSelectors (page, url, selectors = []) {
    await page.goto(url)

    await Promise.all(selectors.map(async (selector) => {
      await page.waitForSelector(selector)
    }))
  }

  static async create (browser, { width = 1024, height = 768, url, watiForSelectors = [] } = {}) {
    const page = await browser.newPage()
    await page.setViewport({ width, height })

    if (url) {
      await this.goAndWaitSelectors(page, url, watiForSelectors)
    }

    return page
  }
}

module.exports = PageHelper
