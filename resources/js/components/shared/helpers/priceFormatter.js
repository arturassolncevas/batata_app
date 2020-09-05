export const formatNumber = {
  format: (value, symbol = null) => {
    return symbol ? `${value} ${symbol}` : value
  },

  parse: (value, options = {}) => {
    console.log(value)
    let { int } = options
    let regex = new RegExp(int ? "[^\\d]" : "[^\\d|\\.]", "g")
    value = value.replace(regex, '')
    let commas = value.match(/\./g) || []
    return commas.length > 1 ? "" : value
  }
}