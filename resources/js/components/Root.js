import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Index from './Index'
import { DatePicker } from 'antd'
import Locale from './locales/Locale'
import RequestInterceptor from './services/RequestInterceptor'

import { IntlProvider } from 'react-intl'
import flatten from 'flat'

//import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/en'
import '@formatjs/intl-relativetimeformat/dist/locale-data/da'

import messages_en from './locales/translations/en.json'
import messages_da from './locales/translations/da.json'

const messages = {
    'en': flatten(messages_en),
    'da': flatten(messages_da)
};

console.log(messages)

const i18nConfig = {
    defaultLocale: 'en',
    messages,
};

const locale = 'en'

function Root() {
    return (
        <BrowserRouter>
            <RequestInterceptor>
                <IntlProvider
                    locale={locale}
                    defaultLocale={i18nConfig.defaultLocale}
                    messages={i18nConfig.messages[locale]}
                >
                    <Index />
                </IntlProvider>
            </RequestInterceptor>
        </BrowserRouter>
    );
}

if (document.getElementById('example')) {
    ReactDOM.render(<Root />, document.getElementById('example'));
}
