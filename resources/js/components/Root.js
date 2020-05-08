import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Index from './Index'
import { DatePicker } from 'antd'

import Locale from './locales/Locale'
import { setupRequestClient } from './services/RequesClient'
import { IntlProvider } from 'react-intl'
import flatten from 'flat'

//import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/en'
import '@formatjs/intl-relativetimeformat/dist/locale-data/da'

import messages_en from './locales/translations/en.json'
import messages_da from './locales/translations/da.json'

//Setup
setupRequestClient()
const locale = 'en'

const messages = {
  'en': flatten(messages_en),
  'da': flatten(messages_da)
};

const i18nConfig = {
  defaultLocale: 'en',
  messages,
};

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <IntlProvider
          locale={locale}
          defaultLocale={i18nConfig.defaultLocale}
          messages={i18nConfig.messages[locale]}
        >
          <Index />
        </IntlProvider>
      </BrowserRouter>
    </Provider>
  );
}

if (document.getElementById('example')) {
  ReactDOM.render(<Root />, document.getElementById('example'));
}
