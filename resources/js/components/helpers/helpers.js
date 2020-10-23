import {setup as setupCurrencyHelper} from './currency_helper'
import {setup as setupNumberHelper} from './number_helper'
import {setup as setupProductFormatter} from './product_formatter'

export const setup = () => {
  setupCurrencyHelper()
  setupNumberHelper()
  setupProductFormatter()
}