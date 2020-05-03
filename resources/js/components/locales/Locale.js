import { Component } from 'react'
import { IntlProvider } from 'react-intl';
import messages_en from './translations/en.json';

const messages = {
	'en': messages_en,
};

const i18nConfig = {
	defaultLocale: 'en',
	messages,
};

const locale = 'en'

export default class Locale extends Component {
	render() {
		return (
			<IntlProvider
				locale={language}
				defaultLocale={i18nConfig.defaultLocale}
				messages={i18nConfig.messages[language]}
			>	
			{props.chldren}
			</IntlProvider>

		)
	}
}

