import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl';
import { addLocaleData } from "react-intl"
import flatten from 'flat'

//import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/dist/locale-data/en'
import '@formatjs/intl-relativetimeformat/dist/locale-data/da'

import messages_en from './translations/en.json';
import messages_da from './translations/da.json';

const messages = {
	'en': flatten(messages_en),
	'da': flatten(messages_da)
};

const i18nConfig = {
	defaultLocale: 'en',
	messages,
};

const locale = 'en'

export default class Locale extends Component {
	render() {
		console.log(this.props)
		return (
			<IntlProvider
				locale={locale}
				defaultLocale={i18nConfig.defaultLocale}
				messages={i18nConfig.messages[locale]}
			>
				{this.props.chldren}
			</IntlProvider>
		)
	}
}

