import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import messages_en from './translations/en.json'
import messages_da from './translations/da.json'
import flatten from 'flat'

const messages = {
  'en': flatten(messages_en),
  'da': flatten(messages_da)
};

// This function will map the current redux state to the props for the component that it is "connected" to.
// When the state of the redux store changes, this function will be called, if the props that come out of
// this function are different, then the component that is wrapped is re-rendered.
function mapStateToProps(state) {
  const { authReducer } = state
  let alias = ((authReducer.user || {}).language || {}).alias || "da"
  
  console.log(alias)
  return {
    locale: alias,
    messages: messages[alias] || messages.en,
    key: alias,
  }
}

export default connect(mapStateToProps)(IntlProvider);

