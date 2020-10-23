import merge from 'deep-merge-js'

class ProductFormatter {
  constructor() {
    this.options = {
      priceFormat: "",
      quantityFormat: "",
      currencySymbol: "",
      salesLimitFormat: ""
    }
  }

  formattedPrice({ price, quantity }) {
    let str = this.options.priceFormat;
    [
      ["<<price>>", price || ""],
      ["<<quantity>>", quantity || ""]
    ].forEach((e) => {
      str = str.replace(RegExp(e[0]), e[1])
    })
    return str
  }

  formattedQuantity({ quantity }) {
    let str = this.options.salesLimitFormat;
    [
      ["<<quantity>>", quantity || "*"]
    ].forEach((e) => { str = str.replace(RegExp(e[0]), e[1]) })
    return str
  }

  setOptions({ currencySymbol, measurementUnitAlias, packed, intl }) {
    this.options = merge(this.options, { currencySymbol, measurementUnitAlias, packed })
    this.options.priceFormat = `<<price>> ${this.options.currencySymbol || ""}/ <<quantity>> ${this.options.measurementUnitAlias}`
    this.options.priceFormat += packed ? ` (${intl.formatMessage({ id: "general.pack" })})` : ""
    this.options.salesLimitFormat = "<<quantity>> "
    this.options.salesLimitFormat += this.options.packed ? `(${intl.formatMessage({ id: "general.packs" })})` : this.options.measurementUnitAlias
  }
}

export const setup = () => {
  return window.ProductFormatter = ProductFormatter
}