const initialState = {
  initialForm: {
    first_name: null,
    last_name: null,
    email: null,
    company: {
      name: null,
      local_code: "",
      address: {
        address_1: null,
        city: null,
        email: null,
        phone: null,
        zipcode: null,
        country: {
          id: "85a5384e-bf34-4a47-be1d-10979f6b1807"
        }
      }
    },
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