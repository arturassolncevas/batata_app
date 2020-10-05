export const formatNumber = {
  format: (value, symbol = null) => {
    return symbol ? `${value} ${symbol}` : value
  },

  parse: (value, options = {}) => {
    if (!value)
      return ""
    let { maxDecimalPoints = 3 } = options
    let regex = new RegExp(maxDecimalPoints <= 0 ? "[^\\d]" : "[^\\d|\\.]", "g")
    value = value.replace(regex, '')
    let devided = value.split(".")
    if (devided.length >= 2) {
      devided[1] = devided[1].slice(0, maxDecimalPoints)
      value = devided[0] + "." + devided[1]
    }
    return value
  }
}