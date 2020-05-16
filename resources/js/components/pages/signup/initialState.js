const initialState = {
  initialForm: {
    name: null,
    company_name: null,
    email: null,
    country_id: null,
    area_code_country_id: null,
    phone: null,
    accept_terms_and_conditions: false,
    recaptcha_value: null,
  },

  error: {
    message: null,
    errors: {
      name: null,
      company_name: null,
      email: null,
      country_id: null,
      area_code_country_id: null,
      phone: null,
      accept_terms_and_conditions: false
    }
  },

  countries: [],
  country: { id: '', area_code: '' },
  isFetching: true,
  successfully_submitted: false,
  recaptcha_value: null,
}

exports.initialState = initialState