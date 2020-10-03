import currency from 'currency.js'

class CurrencyHelper {
  constructor() {
    this.currency = currency
  }

  setOptions(data = {}) {
    let { symbol = "€",  separator = ".", decimal = ",", pattern = "# !" } = data
    this.value = (value) => this.currency(value, { symbol, separator, decimal, pattern })
  }
}

export const setup = (data = {}) => {
  window.currencyHelper = new CurrencyHelper()
  window.currencyHelper.setOptions(data)
  return window.CurrencyHelper
}