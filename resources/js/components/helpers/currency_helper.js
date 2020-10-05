import currency from 'currency.js'

class CurrencyHelper {
  constructor() {
    this.currency = currency
    this.options  = { symbol: "€",  separator: ".", decimal: ",", pattern: "# !" }
  }

  setOptions(data = {}) {
    this.options = { ...this.options, ...data }
    this.value = (value) => this.currency(value, this.options)
  }
}

export const setup = (data = {}) => {
  window.currencyHelper = new CurrencyHelper()
  window.currencyHelper.setOptions(data)
  return window.CurrencyHelper
}