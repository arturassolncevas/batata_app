import {setup as setupCurrencyHelper} from './currency_helper'
import {setup as setupNumberHelper} from './number_helper'

export const setup = () => {
  setupCurrencyHelper()
  setupNumberHelper()
}